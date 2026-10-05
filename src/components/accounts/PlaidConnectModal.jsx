import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useFinance } from '../../context/FinanceContext';
import api from '../../services/api';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  IconShield,
  IconLock,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
} from '../common/Icons';

// Real Plaid Link flow backed by the Express backend:
//   1. POST /api/plaid/create-link-token   -> get a link_token, open Plaid Link
//   2. onSuccess: POST /api/plaid/exchange-public-token (backend saves accounts)
//   3. POST /api/plaid/sync-transactions   -> pull the last N days of history
//   4. refreshAccounts()                   -> re-render with the linked data
export const PlaidConnectModal = ({ isOpen, onClose }) => {
  const { refreshAccounts } = useFinance();

  // 'creating-token' | 'link-ready' | 'exchanging' | 'syncing' | 'success' | 'error'
  const [step, setStep] = useState('creating-token');
  const [error, setError] = useState('');
  const [linkToken, setLinkToken] = useState(null);
  const busyRef = useRef(false);

  const resetFlow = useCallback(() => {
    busyRef.current = false;
    setError('');
    setLinkToken(null);
    setStep('creating-token');
  }, []);

  const handleClose = useCallback(() => {
    resetFlow();
    onClose();
  }, [resetFlow, onClose]);

  const fetchLinkToken = useCallback(() => {
    setStep('creating-token');
    setError('');
    api.plaid
      .createLinkToken()
      .then((data) => {
        setLinkToken(data.link_token);
        setStep('link-ready');
      })
      .catch((err) => {
        setError(err.message || 'Could not initialize the bank connection.');
        setStep('error');
      });
  }, []);

  // Create a fresh link token every time the modal opens
  useEffect(() => {
    if (isOpen) fetchLinkToken();
  }, [isOpen, fetchLinkToken]);

  const handleSuccess = useCallback(
    async (publicToken) => {
      busyRef.current = true;
      setStep('exchanging');
      try {
        await api.plaid.exchangePublicToken(publicToken);
        setStep('syncing');
        try {
          await api.plaid.syncTransactions(90);
        } catch {
          // Non-fatal: the bank is already linked even if the first sync
          // fails — the user can re-sync from the Accounts page.
        }
        await refreshAccounts();
        setStep('success');
      } catch (err) {
        setError(err.message || 'Failed to connect your bank.');
        setStep('error');
      } finally {
        busyRef.current = false;
      }
    },
    [refreshAccounts]
  );

  const handleExit = useCallback((exitError) => {
    // After onSuccess, Plaid Link closes itself — don't treat that as a cancel.
    if (busyRef.current) return;
    if (exitError?.error_code) {
      setError(
        exitError.display_message ||
          exitError.error_message ||
          'Plaid Link closed with an error.'
      );
      setStep('error');
    } else {
      // User closed the Link UI without finishing — back to the intro screen.
      setStep('link-ready');
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
  });

  const connecting = step === 'exchanging' || step === 'syncing';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Connect Bank Account"
      subtitle="Secure account linking powered by Plaid"
      maxWidth="max-w-md"
    >
      {/* Creating link token */}
      {step === 'creating-token' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-brand-text">Preparing secure connection...</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              Requesting a one-time link token from your backend.
            </p>
          </div>
        </div>
      )}

      {/* Ready — open Plaid Link */}
      {step === 'link-ready' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-brand-blue flex items-center gap-1.5">
              <IconLock className="w-3.5 h-3.5" />
              Secure Token Exchange
            </p>
            <p className="text-[11px] leading-relaxed">
              You&apos;ll be redirected to Plaid to sign in to your bank. Your
              credentials go straight to your bank — never to our servers —
              and access is read-only.
            </p>
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={!ready}
            onClick={() => open()}
          >
            Connect your bank
          </Button>

          <div className="flex items-center justify-center gap-2 pt-3 text-[11px] text-slate-400 border-t border-slate-100">
            <IconShield className="w-3.5 h-3.5 text-brand-teal" />
            <span>Encrypted with bank-grade 256-bit TLS security</span>
          </div>
        </div>
      )}

      {/* Exchanging token / syncing transactions */}
      {connecting && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-brand-text">
              {step === 'exchanging' ? 'Connecting your bank...' : 'Importing your transactions...'}
            </h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              {step === 'exchanging'
                ? 'Exchanging the public token and saving your accounts.'
                : 'Pulling the last 90 days of activity. This can take a moment.'}
            </p>
          </div>
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-brand-success flex items-center justify-center shadow-xs">
            <IconCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-brand-text">Bank Connected!</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              Your accounts and transactions are now synchronized.
            </p>
          </div>

          <div className="w-full pt-4">
            <Button variant="primary" className="w-full" onClick={handleClose}>
              Go to Accounts
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {step === 'error' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-danger flex items-center justify-center">
            <IconAlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-brand-text">Connection Failed</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">{error}</p>
          </div>

          <div className="w-full flex items-center gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              icon={IconRefresh}
              onClick={fetchLinkToken}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PlaidConnectModal;
