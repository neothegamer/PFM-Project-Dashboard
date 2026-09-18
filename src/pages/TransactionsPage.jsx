import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Salary', 'Freelance', 'Investment', 'Other'];
const ACCOUNTS_LIST = ['HDFC Corporate Salary', 'ICICI Wealth Savings', 'SBI Prime Black Credit Card', 'Zerodha Demat Liquid'];
const PAGE_SIZE = 8;

const EMPTY_FORM = { description: '', amount: '', type: 'expense', category: 'Food', account: 'HDFC Corporate Salary', date: new Date().toISOString().split('T')[0], notes: '', status: 'Completed' };

const CATEGORY_ICONS = {
  Food: '🍽️', Transport: '🚗', Shopping: '🛍️', Bills: '⚡',
  Entertainment: '🎬', Healthcare: '💊', Salary: '💰', Freelance: '💻',
  Investment: '📈', Other: '📦',
};

const TransactionsPage = () => {
  const { transactions, addTransaction, deleteTransaction, formatCurrency } = useFinance();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openAdd = () => {
    setEditTx(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (tx) => {
    setEditTx(tx);
    setForm({ ...tx, amount: String(tx.amount) });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid positive amount.';
    if (!form.date) errs.date = 'Date is required.';
    return errs;
  };

  const handleSave = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    if (editTx) {
      // For edit, we delete old and add new (context doesn't have updateTransaction)
      deleteTransaction(editTx.id);
      addTransaction({ ...form, id: editTx.id });
      flash('Transaction updated successfully!');
    } else {
      addTransaction(form);
      flash('Transaction added successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
    flash('Transaction deleted.');
  };

  // Filter + Sort
  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterCat) list = list.filter(t => t.category === filterCat);
    if (filterType) list = list.filter(t => t.type === filterType);

    const [field, dir] = sortBy.split('-');
    list.sort((a, b) => {
      let va = field === 'date' ? new Date(a.date) : field === 'amount' ? a.amount : a.description;
      let vb = field === 'date' ? new Date(b.date) : field === 'amount' ? b.amount : b.description;
      if (dir === 'desc') return va < vb ? 1 : -1;
      return va > vb ? 1 : -1;
    });
    return list;
  }, [transactions, search, filterCat, filterType, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Transactions</h2>
          <p className="text-text-secondary text-sm mt-0.5">{filtered.length} transactions found</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Icon name="plus" size={16} /> Add Transaction
        </Button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm animate-slide-up">
          <Icon name="check" size={16} /> {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-navy-deep border border-border rounded-lg px-3 py-2 flex-1">
            <Icon name="search" size={16} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-text-main placeholder-text-muted outline-none w-full"
            />
          </div>
          {/* Category */}
          <select
            value={filterCat}
            onChange={e => { setFilterCat(e.target.value); setPage(1); }}
            className="input-field py-2 sm:w-40"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* Type */}
          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className="input-field py-2 sm:w-36"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field py-2 sm:w-44"
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High→Low</option>
            <option value="amount-asc">Amount: Low→High</option>
            <option value="description-asc">Name: A→Z</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="card overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            title="No transactions found"
            message="Try adjusting your search or filters, or add a new transaction."
            action={<Button variant="primary" size="sm" onClick={openAdd}><Icon name="plus" size={14} /> Add Transaction</Button>}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Date', 'Description', 'Category', 'Account', 'Type', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {paginated.map(tx => (
                    <tr key={tx.id} className="hover:bg-navy-elevated/50 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-text-secondary whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{CATEGORY_ICONS[tx.category] || '💳'}</span>
                          <div>
                            <p className="text-sm font-medium text-text-main">{tx.description}</p>
                            {tx.notes && <p className="text-xs text-text-muted truncate max-w-[180px]">{tx.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="default" size="sm">{tx.category}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-text-secondary max-w-[130px] truncate">{tx.account}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={tx.type === 'income' ? 'income' : 'expense'} size="sm">
                          {tx.type === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                      </td>
                      <td className={`px-4 py-3.5 text-sm font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="success" size="sm">{tx.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(tx)} className="p-1.5 text-text-muted hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all duration-150" aria-label="Edit">
                            <Icon name="edit" size={15} />
                          </button>
                          <button onClick={() => setDeleteConfirm(tx)} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all duration-150" aria-label="Delete">
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border/50">
              {paginated.map(tx => (
                <div key={tx.id} className="p-4 flex items-center gap-3">
                  <div className="text-2xl w-10 flex-shrink-0 text-center">{CATEGORY_ICONS[tx.category] || '💳'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main truncate">{tx.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant={tx.type === 'income' ? 'income' : 'default'} size="xs">{tx.category}</Badge>
                      <span className="text-xs text-text-muted">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <button onClick={() => openEdit(tx)} className="p-1 text-text-muted hover:text-brand-purple rounded"><Icon name="edit" size={13} /></button>
                      <button onClick={() => setDeleteConfirm(tx)} className="p-1 text-text-muted hover:text-danger rounded"><Icon name="trash" size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Page {page} of {totalPages} · {filtered.length} results
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 text-text-muted hover:text-text-main hover:bg-navy-elevated rounded-lg disabled:opacity-40 transition-colors"
                    aria-label="Previous page"
                  >
                    <Icon name="arrowDown" size={16} className="rotate-90" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 ${page === p ? 'bg-brand-purple text-white' : 'text-text-muted hover:text-text-main hover:bg-navy-elevated'}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 text-text-muted hover:text-text-main hover:bg-navy-elevated rounded-lg disabled:opacity-40 transition-colors"
                    aria-label="Next page"
                  >
                    <Icon name="arrowDown" size={16} className="-rotate-90" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTx ? 'Edit Transaction' : 'Add Transaction'} size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Description *</label>
            <input value={form.description} onChange={e => setField('description', e.target.value)} className={`input-field ${formErrors.description ? 'border-danger' : ''}`} placeholder="e.g. Swiggy order" />
            {formErrors.description && <p className="mt-1 text-xs text-danger">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount (₹) *</label>
              <input type="number" min="0" value={form.amount} onChange={e => setField('amount', e.target.value)} className={`input-field ${formErrors.amount ? 'border-danger' : ''}`} placeholder="0" />
              {formErrors.amount && <p className="mt-1 text-xs text-danger">{formErrors.amount}</p>}
            </div>
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={e => setField('type', e.target.value)} className="input-field">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => setField('category', e.target.value)} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Account</label>
              <select value={form.account} onChange={e => setField('account', e.target.value)} className="input-field">
                {ACCOUNTS_LIST.map(a => <option key={a} value={a}>{a.split(' ').slice(0, 2).join(' ')}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Date *</label>
            <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} className={`input-field ${formErrors.date ? 'border-danger' : ''}`} />
            {formErrors.date && <p className="mt-1 text-xs text-danger">{formErrors.date}</p>}
          </div>

          <div>
            <label className="label">Notes <span className="text-text-muted">(optional)</span></label>
            <textarea value={form.notes} onChange={e => setField('notes', e.target.value)} className="input-field resize-none" rows={2} placeholder="Additional details..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              <Icon name="check" size={15} />
              {editTx ? 'Update' : 'Add Transaction'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Transaction" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="trash" size={24} className="text-danger" />
          </div>
          <p className="text-text-main font-semibold mb-1">Delete this transaction?</p>
          <p className="text-sm text-text-secondary mb-2">{deleteConfirm?.description}</p>
          <p className={`text-lg font-bold mb-5 ${deleteConfirm?.type === 'income' ? 'text-income' : 'text-expense'}`}>
            {deleteConfirm?.type === 'income' ? '+' : '-'}{deleteConfirm ? formatCurrency(deleteConfirm.amount) : ''}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
