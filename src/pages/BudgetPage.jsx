import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'];
const COLORS = ['#8B5CF6', '#2DD4BF', '#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#2563EB', '#10B981', '#F59E0B', '#DC2626'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EMPTY_FORM = { category: 'Food', limit: '', notes: '', startMonth: new Date().getMonth() + 1, color: COLORS[0] };

const BudgetPage = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, formatCurrency } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalLimit - totalSpent;
  const overallPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;

  const getStatus = (pct) => {
    if (pct >= 100) return { label: 'Over Budget', variant: 'over' };
    if (pct >= 80) return { label: 'Approaching', variant: 'approaching' };
    return { label: 'Healthy', variant: 'healthy' };
  };

  const openAdd = () => {
    setEditBudget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditBudget(b);
    setForm({ category: b.category, limit: String(b.limit), notes: b.notes || '', startMonth: b.startMonth || 1, color: b.color });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.limit || isNaN(Number(form.limit)) || Number(form.limit) <= 0) errs.limit = 'Enter a valid budget amount.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    if (editBudget) {
      updateBudget(editBudget.id, { ...form, limit: Number(form.limit) });
      flash('Budget updated successfully!');
    } else {
      // Check for duplicate category
      if (budgets.find(b => b.category === form.category)) {
        setFormErrors({ category: 'A budget for this category already exists.' });
        return;
      }
      addBudget({ ...form, limit: Number(form.limit), spent: 0 });
      flash('Budget created successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    deleteBudget(id);
    setDeleteConfirm(null);
    flash('Budget deleted.');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Budget</h2>
          <p className="text-text-secondary text-sm mt-0.5">Plan your spending and stay on track.</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Icon name="plus" size={16} /> Create Budget
        </Button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm animate-slide-up">
          <Icon name="check" size={16} /> {successMsg}
        </div>
      )}

      {/* Over-budget alert */}
      {overBudgetCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl animate-slide-up">
          <Icon name="alertTriangle" size={18} className="text-danger flex-shrink-0" />
          <p className="text-sm text-danger font-medium">
            {overBudgetCount} {overBudgetCount === 1 ? 'category has' : 'categories have'} exceeded the monthly budget.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: formatCurrency(totalLimit), color: 'text-brand-purple' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), color: 'text-expense' },
          { label: 'Remaining', value: formatCurrency(Math.max(0, totalRemaining)), color: 'text-income' },
          { label: 'Overall Usage', value: `${overallPct}%`, color: overallPct >= 100 ? 'text-danger' : overallPct >= 80 ? 'text-warning' : 'text-success' },
        ].map(s => (
          <div key={s.label} className="card p-4 animate-slide-up">
            <p className="text-xs text-text-muted mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Monthly Budget Usage</span>
          <span className={`text-sm font-bold ${overallPct >= 100 ? 'text-danger' : overallPct >= 80 ? 'text-warning' : 'text-success'}`}>{overallPct}%</span>
        </div>
        <ProgressBar value={totalSpent} max={totalLimit} color="auto" />
        <div className="flex justify-between mt-1 text-xs text-text-muted">
          <span>{formatCurrency(totalSpent)} spent</span>
          <span>{formatCurrency(totalLimit)} total</span>
        </div>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <EmptyState
          title="No budgets created yet"
          message="Create a budget category to start tracking your monthly spending limits."
          action={<Button variant="primary" size="sm" onClick={openAdd}><Icon name="plus" size={14} /> Create Budget</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map((b, idx) => {
            const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
            const remaining = b.limit - b.spent;
            const isOver = b.spent > b.limit;
            const status = getStatus(pct);

            return (
              <div
                key={b.id}
                className={`card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 animate-slide-up ${isOver ? 'border-danger/40' : ''}`}
                style={{ animationDelay: `${0.05 * idx}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${b.color}20` }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-text-main">{b.category}</p>
                      <Badge variant={status.variant} size="xs">{status.label}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-1.5 text-text-muted hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all" aria-label="Edit budget">
                      <Icon name="edit" size={14} />
                    </button>
                    <button onClick={() => setDeleteConfirm(b)} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all" aria-label="Delete budget">
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-muted">Progress</span>
                    <span className={`font-bold ${isOver ? 'text-danger' : pct >= 80 ? 'text-warning' : 'text-success'}`}>{pct}%</span>
                  </div>
                  <ProgressBar value={b.spent} max={b.limit} color="auto" />
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-navy-deep rounded-lg p-2.5">
                    <p className="text-xs text-text-muted mb-0.5">Budget</p>
                    <p className="font-bold text-text-main">{formatCurrency(b.limit)}</p>
                  </div>
                  <div className="bg-navy-deep rounded-lg p-2.5">
                    <p className="text-xs text-text-muted mb-0.5">Spent</p>
                    <p className={`font-bold ${isOver ? 'text-danger' : 'text-expense'}`}>{formatCurrency(b.spent)}</p>
                  </div>
                </div>

                {isOver ? (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-danger bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
                    <Icon name="alertTriangle" size={12} />
                    Over by {formatCurrency(Math.abs(remaining))}
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-success bg-success/5 border border-success/20 rounded-lg px-3 py-2">
                    <Icon name="check" size={12} />
                    {formatCurrency(remaining)} remaining
                  </div>
                )}

                {b.notes && (
                  <p className="mt-2 text-xs text-text-muted line-clamp-1">{b.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editBudget ? 'Edit Budget' : 'Create Budget'} size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className={`input-field ${formErrors.category ? 'border-danger' : ''}`}
              disabled={!!editBudget}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {formErrors.category && <p className="mt-1 text-xs text-danger">{formErrors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Monthly Limit (₹) *</label>
              <input
                type="number"
                min="1"
                value={form.limit}
                onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                className={`input-field ${formErrors.limit ? 'border-danger' : ''}`}
                placeholder="e.g. 5000"
              />
              {formErrors.limit && <p className="mt-1 text-xs text-danger">{formErrors.limit}</p>}
            </div>
            <div>
              <label className="label">Start Month</label>
              <select value={form.startMonth} onChange={e => setForm(f => ({ ...f, startMonth: Number(e.target.value) }))} className="input-field">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-white/40' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="label">Notes <span className="text-text-muted">(optional)</span></label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="input-field resize-none"
              rows={2}
              placeholder="e.g. Groceries, dining, food delivery"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              <Icon name="check" size={15} />
              {editBudget ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Budget" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" size={24} className="text-danger" />
          </div>
          <p className="text-text-main font-semibold mb-1">Delete {deleteConfirm?.category} budget?</p>
          <p className="text-sm text-text-secondary mb-6">This action cannot be undone. You'll lose all tracking data for this category.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetPage;
