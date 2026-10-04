import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const AddTransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction, accounts } = useFinance();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    account: accounts[0]?.name || 'HDFC Corporate Salary',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Salary',
    'Freelance',
    'Investment',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.date) newErrors.date = 'Date is required';
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
    // Simulate minor async API post delay
    setTimeout(() => {
      addTransaction(formData);
      setLoading(false);
      onClose();
      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        account: accounts[0]?.name || 'HDFC Corporate Salary',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Transaction"
      subtitle="Record a manual expense or income transaction"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: 'expense' }))}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-white text-brand-danger shadow-xs'
                  : 'text-slate-600 hover:text-brand-text'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: 'income' }))}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-white text-brand-success shadow-xs'
                  : 'text-slate-600 hover:text-brand-text'
              }`}
            >
              Income (+)
            </button>
          </div>
        </div>

        {/* Description */}
        <Input
          label="Description"
          name="description"
          placeholder="e.g. Whole Foods Organic Market"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
        />

        {/* Amount & Date in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (₹)"
            name="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            required
          />

          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
        </div>

        {/* Category & Account */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-border py-2.5 px-3 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Account
            </label>
            <select
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="w-full rounded-lg border border-brand-border py-2.5 px-3 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.name}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add contextual details or receipt references..."
            className="w-full rounded-lg border border-brand-border py-2 px-3 text-sm text-brand-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
