import React, { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import api from '../services/api.js';

const AccountCard = ({ account, formatCurrency }) => {
  const isCredit =
    (account.type || '').toLowerCase().includes('credit') ||
    (account.subtype || '').toLowerCase().includes('credit');
  const balance = Number(account.balance) || 0;

  return (
    <div
      className="card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
      style={{ borderLeft: `3px solid ${account.color || '#8B5CF6'}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-text-main">{account.name}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {account.institution || 'Linked bank'}
          </p>
        </div>
        <Badge
          variant={account.status === 'Connected' ? 'success' : 'warning'}
          size="xs"
        >
          {account.status || 'Connected'}
        </Badge>
      </div>

      <div className="mb-3">
        <p className="text-xs text-text-muted mb-1">
          {isCredit ? 'Outstanding Balance' : 'Available Balance'}
        </p>
        <p
          className={`text-2xl font-bold ${
            balance < 0 ? 'text-danger' : 'text-text-main'
          }`}
        >
          {formatCurrency(Math.abs(balance))}
          {balance < 0 && (
            <span className="text-sm text-danger ml-1">due</span>
          )}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div>
          <p className="text-xs text-text-muted">
            {account.accountNumber || (account.mask ? `•••• ${account.mask}` : '••••')}
          </p>
          <Badge variant="default" size="xs" className="mt-1">
            {account.subtype || account.type || 'Account'}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Last sync</p>
          <p className="text-xs text-text-secondary">
            {account.lastSync || 'Just now'}
          </p>
        </div>
      </div>
    </div>
  );
};

const AccountsPage = () => {
  const {
    accounts,
    formatCurrency,
    loadData,
    refreshAccounts,
  } = useFinance();

  const [linkToken, setLinkToken] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Fetch a link_token when user clicks "Connect Account"
  const startPlaidLink = async () => {
    setErrorMsg('');
    setLinkLoading(true);
    try {
      const data = await api.plaid.createLinkToken();
      setLinkToken(data.link_token);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to start bank linking');
      setLinkLoading(false);
    }
  };

  // Called by Plaid when user finishes selecting a bank
  const onPlaidSuccess = useCallback(
    async (publicToken, metadata) => {
      setLinkLoading(false);
      setLinkToken(null);
      setSyncing(true);
      setErrorMsg('');
      try {
        // 1. Exchange public_token → save accounts
        await api.plaid.exchangePublicToken(publicToken);

        // 2. Pull recent transactions
        try {
          await api.plaid.syncTransactions();
        } catch (syncErr) {
          // Sync can fail if PRODUCT_NOT_READY; accounts still linked
          console.warn('Sync warning:', syncErr.message);
        }

        // 3. Refresh UI data
        if (loadData) await loadData();
        else if (refreshAccounts) await refreshAccounts();

        const bankName =
          metadata?.institution?.name || 'Bank';
        flash(`${bankName} linked successfully. Transactions synced.`);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to link bank');
      } finally {
        setSyncing(false);
      }
    },
    [loadData, refreshAccounts]
  );

  const onPlaidExit = useCallback(() => {
    setLinkLoading(false);
    setLinkToken(null);
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: onPlaidExit,
  });

  // Open Plaid Link as soon as we have a token
  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  const handleRefreshBalances = async () => {
    setSyncing(true);
    setErrorMsg('');
    try {
      await api.plaid.refreshBalances();
      await api.plaid.syncTransactions();
      if (loadData) await loadData();
      flash('Balances and transactions refreshed.');
    } catch (err) {
      setErrorMsg(err.message || 'Refresh failed');
    } finally {
      setSyncing(false);
    }
  };

  const totalBalance = accounts.reduce(
    (s, a) => s + (Number(a.balance) || 0),
    0
  );
  const totalAssets = accounts
    .filter((a) => (Number(a.balance) || 0) > 0)
    .reduce((s, a) => s + (Number(a.balance) || 0), 0);
  const totalLiabilities = accounts
    .filter((a) => (Number(a.balance) || 0) < 0)
    .reduce((s, a) => s + Math.abs(Number(a.balance) || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Accounts</h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Link your bank securely with Plaid
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {accounts.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleRefreshBalances}
              disabled={syncing}
            >
              <Icon name="refresh" size={16} />
              {syncing ? 'Syncing…' : 'Refresh'}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={startPlaidLink}
            disabled={linkLoading || syncing}
          >
            {linkLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Opening Plaid…
              </span>
            ) : (
              <>
                <Icon name="link" size={16} /> Connect Account
              </>
            )}
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm animate-slide-up">
          <Icon name="check" size={16} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
          <Icon name="alertTriangle" size={16} /> {errorMsg}
        </div>
      )}

      {syncing && (
        <div className="flex items-center gap-2 px-4 py-3 bg-brand-purple/10 border border-brand-purple/30 rounded-xl text-brand-purple text-sm">
          <span className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          Linking bank &amp; syncing transactions…
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Net Worth',
            value: formatCurrency(totalBalance),
            color: 'text-brand-purple',
          },
          {
            label: 'Total Assets',
            value: formatCurrency(totalAssets),
            color: 'text-income',
          },
          {
            label: 'Total Liabilities',
            value: formatCurrency(totalLiabilities),
            color: 'text-expense',
          },
        ].map((s) => (
          <div key={s.label} className="card p-4 animate-slide-up">
            <p className="text-xs text-text-muted mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Account cards */}
      {accounts.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="link" size={28} className="text-brand-purple" />
          </div>
          <h3 className="text-lg font-semibold text-text-main mb-2">
            No accounts linked yet
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            Connect a bank with Plaid (sandbox works with fake banks — no real
            login required).
          </p>
          <Button
            variant="primary"
            onClick={startPlaidLink}
            disabled={linkLoading || syncing}
          >
            <Icon name="link" size={16} /> Connect your first account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id || acc._id}
              account={acc}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;