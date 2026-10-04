import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const AddAccountModal = ({ isOpen, onClose }) => {
  const { addAccount } = useFinance();

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    type: 'Savings',
    balance: '',
    accountNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const accountTypes = ['Checking', 'Savings', 'Credit Card', 'Investment', 'Cash Wallet'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Account name is required';
    if (!formData.institution.trim()) newErrors.institution = 'Bank or institution is required';
    if (!formData.balance && formData.balance !== 0) newErrors.balance = 'Initial balance is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      await addAccount({
        name: formData.name.trim(),
        institution: formData.institution.trim(),
        type: formData.type,
        balance: Number(formData.balance),
        accountNumber: formData.accountNumber,
      });
      onClose();
      setFormData({
        name: '',
        institution: '',
        type: 'Savings',
        balance: '',
        accountNumber: '',
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to add account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Financial Account"
      subtitle="Manually track a bank account, credit card, or wallet"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <Input
          label="Account Name"
          name="name"
          placeholder="e.g. Salary Checking"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Institution / Bank"
            name="institution"
            placeholder="e.g. HDFC Bank, Chase"
            value={formData.institution}
            onChange={handleChange}
            error={errors.institution}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Account Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-border py-2.5 px-3 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {accountTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current Balance (₹)"
            name="balance"
            type="number"
            placeholder="0.00"
            value={formData.balance}
            onChange={handleChange}
            error={errors.balance}
            helperText="For credit cards, enter current outstanding"
            required
          />

          <Input
            label="Account Number / Last 4 Digits"
            name="accountNumber"
            placeholder="e.g. 5432"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Add Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;