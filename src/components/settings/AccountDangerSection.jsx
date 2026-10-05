import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { IconLogOut, IconTrash, IconAlertCircle } from '../common/Icons';

export const AccountDangerSection = () => {
  const { logoutUser, deleteAccount } = useFinance();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const openModal = () => {
    setPassword('');
    setErrorMsg('');
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setPassword('');
    setErrorMsg('');
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setErrorMsg('Enter your current password to confirm.');
      return;
    }
    setErrorMsg('');
    setDeleting(true);
    try {
      // Backend disconnects every linked bank at Plaid, then deletes all
      // data. On success the context clears the token, resets state, and
      // routes to landing. On failure (wrong password, Plaid error) it
      // throws and the account stays intact.
      await deleteAccount(password);
    } catch (err) {
      setErrorMsg(err.message || 'Could not delete your account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-card">
      <div className="pb-5 border-b border-slate-100 mb-6">
        <h3 className="text-base font-bold text-brand-text">Account Session & Danger Zone</h3>
        <p className="text-xs text-brand-muted">Manage active sessions and account lifecycle</p>
      </div>

      <div className="space-y-4">
        {/* Logout action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <h4 className="text-sm font-semibold text-brand-text">Sign Out of FinFlow</h4>
            <p className="text-xs text-brand-muted">
              End your active session securely on this device
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={logoutUser}>
            <IconLogOut size={15} /> Log Out
          </Button>
        </div>

        {/* Delete Account action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50/60 border border-red-100">
          <div>
            <h4 className="text-sm font-semibold text-brand-danger">Delete Financial Profile</h4>
            <p className="text-xs text-slate-600">
              Permanently erase all transaction histories, budgets, and linked accounts
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={openModal}>
            <IconTrash size={15} /> Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal — password-gated */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeModal}
        title="Permanently Delete Account?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-brand-danger">
            <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              This action cannot be undone. All your bank linkages, personal
              budgets, and transaction history will be purged immediately.
            </p>
          </div>

          <Input
            label="Current Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to confirm"
            required
          />

          {errorMsg && (
            <p className="text-xs font-semibold text-brand-danger flex items-center gap-1.5">
              <IconAlertCircle className="w-3.5 h-3.5" /> {errorMsg}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={closeModal} disabled={deleting}>
              Keep My Account
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleting || !password}
            >
              {deleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <IconTrash size={15} /> Yes, Purge Everything
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountDangerSection;
