import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';

const BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', color: '#004c8f', popular: true },
  { id: 'icici', name: 'ICICI Bank', color: '#a9211c', popular: true },
  { id: 'sbi', name: 'State Bank of India', color: '#0070bc', popular: true },
  { id: 'axis', name: 'Axis Bank', color: '#97144d', popular: true },
  { id: 'kotak', name: 'Kotak Mahindra Bank', color: '#ed1c24', popular: true },
  { id: 'paytm', name: 'Paytm Payments Bank', color: '#002970', popular: false },
  { id: 'zerodha', name: 'Zerodha Broking', color: '#387ED1', popular: false },
];

const ACCOUNT_TYPES = ['Checking', 'Savings', 'Credit Card', 'Investment', 'Cash Wallet'];
const COLORS = ['#8B5CF6', '#2DD4BF', '#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#2563EB'];

const AccountCard = ({ account, formatCurrency }) => {
  const isCreditCard = account.type === 'Credit Card';
  const balance = account.balance;

  return (
    <div
      className="card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
      style={{ borderLeft: `3px solid ${account.color}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-text-main">{account.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{account.institution}</p>
        </div>
        <Badge variant={account.status === 'Connected' ? 'success' : 'warning'} size="xs">
          {account.status}
        </Badge>
      </div>

      <div className="mb-3">
        <p className="text-xs text-text-muted mb-1">{isCreditCard ? 'Outstanding Balance' : 'Available Balance'}</p>
        <p className={`text-2xl font-bold ${balance < 0 ? 'text-danger' : 'text-text-main'}`}>
          {formatCurrency(Math.abs(balance))}
          {balance < 0 && <span className="text-sm text-danger ml-1">due</span>}
        </p>
      </div>

      {isCreditCard && account.creditLimit && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>Credit Used</span>
            <span>{formatCurrency(account.availableBalance)} available</span>
          </div>
          <div className="h-1.5 bg-navy-deep rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-danger/70 transition-all duration-1000"
              style={{ width: `${Math.min((Math.abs(balance) / account.creditLimit) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div>
          <p className="text-xs text-text-muted">{account.accountNumber}</p>
          <Badge variant="default" size="xs" className="mt-1">{account.type}</Badge>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Last sync</p>
          <p className="text-xs text-text-secondary">{account.lastSync}</p>
        </div>
      </div>
    </div>
  );
};

const AccountsPage = () => {
  const { accounts, addAccount, formatCurrency } = useFinance();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState(1); // 1=select, 2=connecting, 3=success
  const [selectedBank, setSelectedBank] = useState(null);
  const [showAddManual, setShowAddManual] = useState(false);
  const [manualForm, setManualForm] = useState({ name: '', institution: '', type: 'Savings', accountNumber: '', balance: '', color: COLORS[0] });
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalAssets = accounts.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);

  const startConnect = (bank) => {
    setSelectedBank(bank);
    setConnectStep(2);
    setTimeout(() => setConnectStep(3), 2200);
  };

  const finishConnect = () => {
    addAccount({
      name: `${selectedBank.name} Account`,
      institution: selectedBank.name,
      type: 'Savings',
      accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Math.floor(10000 + Math.random() * 90000),
      availableBalance: 0,
      isPrimary: false,
      color: selectedBank.color,
    });
    setShowConnectModal(false);
    setConnectStep(1);
    setSelectedBank(null);
    flash('Account connected successfully!');
  };

  const validateManual = () => {
    const errs = {};
    if (!manualForm.name.trim()) errs.name = 'Account name is required.';
    if (!manualForm.institution.trim()) errs.institution = 'Institution name is required.';
    if (!manualForm.balance || isNaN(Number(manualForm.balance))) errs.balance = 'Enter a valid balance.';
    return errs;
  };

  const handleAddManual = () => {
    const errs = validateManual();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    addAccount({
      name: manualForm.name,
      institution: manualForm.institution,
      type: manualForm.type,
      accountNumber: manualForm.accountNumber || '•••• XXXX',
      balance: Number(manualForm.balance),
      availableBalance: Number(manualForm.balance),
      isPrimary: false,
      color: manualForm.color,
    });
    setShowAddManual(false);
    setManualForm({ name: '', institution: '', type: 'Savings', accountNumber: '', balance: '', color: COLORS[0] });
    setFormErrors({});
    flash('Account added successfully!');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Accounts</h2>
          <p className="text-text-secondary text-sm mt-0.5">Manage your connected financial accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowAddManual(true)}>
            <Icon name="plus" size={16} /> Add Manual
          </Button>
          <Button variant="primary" onClick={() => { setShowConnectModal(true); setConnectStep(1); }}>
            <Icon name="link" size={16} /> Connect Account
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm animate-slide-up">
          <Icon name="check" size={16} /> {successMsg}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Net Worth', value: formatCurrency(totalBalance), color: 'text-brand-purple' },
          { label: 'Total Assets', value: formatCurrency(totalAssets), color: 'text-income' },
          { label: 'Total Liabilities', value: formatCurrency(totalLiabilities), color: 'text-expense' },
        ].map(s => (
          <div key={s.label} className="card p-4 animate-slide-up">
            <p className="text-xs text-text-muted mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} formatCurrency={formatCurrency} />
        ))}
      </div>

      {/* Connect Account Modal */}
      <Modal isOpen={showConnectModal} onClose={() => { setShowConnectModal(false); setConnectStep(1); }} title="Connect Bank Account" size="md">
        {connectStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Select your bank to securely link your account (mock Plaid flow)</p>
            <div className="mb-2">
              <p className="text-xs text-text-muted font-semibold uppercase mb-2">Popular Banks</p>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.filter(b => b.popular).map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => startConnect(bank)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bank.color }}>
                      <span className="text-white font-bold text-xs">{bank.name[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-text-main truncate">{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted font-semibold uppercase mb-2">Other</p>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.filter(b => !b.popular).map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => startConnect(bank)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bank.color }}>
                      <span className="text-white font-bold text-xs">{bank.name[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-text-main truncate">{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {connectStep === 2 && (
          <div className="py-8 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
            <p className="text-text-main font-semibold">Connecting to {selectedBank?.name}…</p>
            <p className="text-sm text-text-secondary">Securely establishing connection…</p>
          </div>
        )}

        {connectStep === 3 && (
          <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
              <Icon name="check" size={28} className="text-success" />
            </div>
            <div>
              <p className="text-text-main font-bold text-lg">{selectedBank?.name} Connected!</p>
              <p className="text-sm text-text-secondary mt-1">Your account has been securely linked</p>
            </div>
            <Button variant="primary" onClick={finishConnect}>
              Done — Go to Accounts
            </Button>
          </div>
        )}
      </Modal>

      {/* Add Manual Modal */}
      <Modal isOpen={showAddManual} onClose={() => setShowAddManual(false)} title="Add Account Manually" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Account Name *</label>
              <input value={manualForm.name} onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))} className={`input-field ${formErrors.name ? 'border-danger' : ''}`} placeholder="e.g. HDFC Savings" />
              {formErrors.name && <p className="mt-1 text-xs text-danger">{formErrors.name}</p>}
            </div>
            <div>
              <label className="label">Institution *</label>
              <input value={manualForm.institution} onChange={e => setManualForm(f => ({ ...f, institution: e.target.value }))} className={`input-field ${formErrors.institution ? 'border-danger' : ''}`} placeholder="e.g. HDFC Bank" />
              {formErrors.institution && <p className="mt-1 text-xs text-danger">{formErrors.institution}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Account Type</label>
              <select value={manualForm.type} onChange={e => setManualForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Balance (₹) *</label>
              <input type="number" value={manualForm.balance} onChange={e => setManualForm(f => ({ ...f, balance: e.target.value }))} className={`input-field ${formErrors.balance ? 'border-danger' : ''}`} placeholder="0" />
              {formErrors.balance && <p className="mt-1 text-xs text-danger">{formErrors.balance}</p>}
            </div>
          </div>
          <div>
            <label className="label">Account Number (optional)</label>
            <input value={manualForm.accountNumber} onChange={e => setManualForm(f => ({ ...f, accountNumber: e.target.value }))} className="input-field" placeholder="•••• 1234" />
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setManualForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full transition-transform ${manualForm.color === c ? 'scale-125 ring-2 ring-white/40' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddManual(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddManual}><Icon name="check" size={15} /> Add Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountsPage;
