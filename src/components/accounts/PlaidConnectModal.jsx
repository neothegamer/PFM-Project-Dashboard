import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { plaidMockBanks } from '../../data/mockData';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  IconShield,
  IconLock,
  IconCheck,
  IconSearch,
  IconAlertCircle,
  IconRefresh
} from '../common/Icons';

export const PlaidConnectModal = ({ isOpen, onClose }) => {
  const { addAccount } = useFinance();

  // Steps: 'select-bank' | 'credentials' | 'connecting' | 'success' | 'error'
  const [step, setStep] = useState('select-bank');
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankSearch, setBankSearch] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [simulateError, setSimulateError] = useState(false);

  const resetFlow = () => {
    setStep('select-bank');
    setSelectedBank(null);
    setBankSearch('');
    setUsername('');
    setPassword('');
    setSimulateError(false);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  const filteredBanks = plaidMockBanks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setStep('credentials');
  };

  const handleAuthorize = () => {
    setStep('connecting');

    setTimeout(() => {
      if (simulateError) {
        setStep('error');
      } else {
        // Automatically add account
        addAccount({
          name: `${selectedBank.name} Premium Checking`,
          institution: selectedBank.name,
          type: 'Checking',
          accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
          balance: 65000,
          availableBalance: 65000,
          color: selectedBank.logoColor,
          status: 'Connected',
          lastSync: 'Just now'
        });
        setStep('success');
      }
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Connect Bank Account"
      subtitle="Instant automated sync via Plaid API integration flow"
      maxWidth="max-w-md"
    >
      {/* Step 1: Select Bank */}
      {step === 'select-bank' && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IconSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              placeholder="Search your bank (e.g. HDFC, ICICI, SBI)..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
              Popular Financial Institutions
            </span>
            {filteredBanks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleSelectBank(bank)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                    style={{ backgroundColor: bank.logoColor }}
                  >
                    {bank.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text group-hover:text-brand-blue transition-colors">
                      {bank.name}
                    </p>
                    <span className="text-[11px] text-brand-muted">Instant account verification</span>
                  </div>
                </div>
                <span className="text-xs text-brand-blue font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Connect &rarr;
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 pt-3 text-[11px] text-slate-400 border-t border-slate-100">
            <IconShield className="w-3.5 h-3.5 text-brand-teal" />
            <span>Encrypted with bank-grade 256-bit TLS security</span>
          </div>
        </div>
      )}

      {/* Step 2: Credentials / Consent */}
      {step === 'credentials' && selectedBank && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: selectedBank.logoColor }}
            >
              {selectedBank.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-text">{selectedBank.name}</h4>
              <p className="text-xs text-brand-muted">Log in to grant read-only access</p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Online Banking ID / User ID"
              placeholder="Enter your customer ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password / IPIN"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-brand-blue flex items-center gap-1.5">
              <IconLock className="w-3.5 h-3.5" />
              Secure Token Exchange
            </p>
            <p className="text-[11px] leading-relaxed">
              Your credentials are never stored on our servers. Plaid uses read-only OAuth tokens to securely import balances and transactions.
            </p>
          </div>

          {/* Optional toggle to test error state */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Simulate Connection Error (Testing):</span>
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
              className="rounded text-brand-blue focus:ring-brand-blue"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setStep('select-bank')}>
              Back
            </Button>
            <Button variant="primary" onClick={handleAuthorize}>
              Authorize & Connect
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Connecting State */}
      {step === 'connecting' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center relative">
            <div className="w-10 h-10 border-3 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-brand-text">Connecting to {selectedBank?.name}...</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              Verifying multi-factor credentials and retrieving real-time account data.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Success State */}
      {step === 'success' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-brand-success flex items-center justify-center shadow-xs">
            <IconCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-brand-text">Account Connected!</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              Successfully linked <span className="font-semibold text-brand-text">{selectedBank?.name}</span>. Your transactions and balances are now synchronized.
            </p>
          </div>

          <div className="w-full pt-4">
            <Button variant="primary" className="w-full" onClick={handleClose}>
              Go to Accounts
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Error State */}
      {step === 'error' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-danger flex items-center justify-center">
            <IconAlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-brand-text">Connection Failed</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-xs">
              Unable to authenticate with {selectedBank?.name}. Please double-check your credentials or try again later.
            </p>
          </div>

          <div className="w-full flex items-center gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              icon={IconRefresh}
              onClick={() => setStep('credentials')}
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
