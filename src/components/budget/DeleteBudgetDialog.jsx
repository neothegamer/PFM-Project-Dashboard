import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { IconAlertCircle } from '../common/Icons';

export const DeleteBudgetDialog = ({ isOpen, onClose, budget }) => {
  const { deleteBudget } = useFinance();

  if (!budget) return null;

  const handleDelete = () => {
    deleteBudget(budget.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category Budget"
      maxWidth="max-w-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-red-50 text-brand-danger rounded-xl border border-red-100">
          <IconAlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium leading-relaxed">
            Are you sure you want to remove the <strong className="font-bold">{budget.category}</strong> budget?
            Historical transactions will remain unaffected.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Budget
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBudgetDialog;
