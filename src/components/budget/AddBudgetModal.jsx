import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export const AddBudgetModal = ({ isOpen, onClose, initialData = null }) => {
  const { addBudget, updateBudget, budgets } = useFinance();

  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const availableCategories = [
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Education',
    'Fitness',
    'Travel',
    'Other'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category,
        limit: initialData.limit,
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        category: 'Food',
        limit: '',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!isEditing) {
      const exists = budgets.some(
        (b) => b.category.toLowerCase() === formData.category.toLowerCase()
      );
      if (exists) {
        newErrors.category = `A budget for "${formData.category}" already exists. You can edit it instead.`;
      }
    }
    if (!formData.limit || Number(formData.limit) <= 0) {
      newErrors.limit = 'Please enter a valid monthly limit greater than 0';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (isEditing) {
        updateBudget(initialData.id, formData);
      } else {
        addBudget(formData);
      }
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category Budget' : 'Create New Budget'}
      subtitle={
        isEditing
          ? 'Adjust monthly spending ceiling'
          : 'Define a monthly spending cap for a financial category'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Spending Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isEditing}
            className="w-full rounded-lg border border-brand-border py-2.5 px-3 text-sm text-brand-text bg-white disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-brand-danger">{errors.category}</p>
          )}
        </div>

        {/* Monthly Limit */}
        <Input
          label="Monthly Spending Limit (₹)"
          name="limit"
          type="number"
          placeholder="e.g. 5000"
          value={formData.limit}
          onChange={handleChange}
          error={errors.limit}
          helperText="We will alert you when spending reaches 80% and 100% of this limit."
          required
        />

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Budget Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Weekly restaurant dinners and grocery runs"
            className="w-full rounded-lg border border-brand-border py-2 px-3 text-sm text-brand-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditing ? 'Save Changes' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
