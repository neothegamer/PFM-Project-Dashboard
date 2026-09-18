import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { IconLogOut, IconTrash, IconAlertCircle } from '../common/Icons';

export const AccountDangerSection = () => {
  const { logoutUser } = useFinance();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    logoutUser();
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
          <Button
            variant="secondary"
            size="sm"
            icon={IconLogOut}
            onClick={logoutUser}
          >
            Log Out
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
          <Button
            variant="danger"
            size="sm"
            icon={IconTrash}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Permanently Delete Account?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-brand-danger">
            <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              This action cannot be undone. All your bank linkages, personal budgets, category rules, and transaction history will be purged immediately.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Keep My Account
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Yes, Purge Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountDangerSection;
