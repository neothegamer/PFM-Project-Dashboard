import React, { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useFinance } from '../context/FinanceContext.jsx';
import { Icon } from '../components/common/Icons.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import api from '../services/api.js';

const AccountCard = ({
  account,
  formatCurrency,
  isFailed,
  onUnlink,
  onRemove,
  onReconnect,
}) => {
  const isCredit =
    (account.type || '').toLowerCase().includes('credit') ||
    (account.subtype || '').toLowerCase().includes('credit');
  const balance = Number(account.balance) || 0;
  const isManual = account.itemId === 'manual';

  return (
    <div
      className="card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 animate-slide-up"
      style={{ borderLeft: `3px solid ${account.color || '#8B5CF6'}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-text-main">{account.name}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {account.institution || (isManual ? 'Manual account' : 'Linked bank')}
          </p>
        </div>
        <Badge
          variant={isFailed ? 'warning' : 'success'}
          size="xs"
        >
          {isFailed ? 'Action required' : account.status || 'Connected'}
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

      {/* Card actions */}
      <div className="flex items-center justify-end gap-2 pt-3">
        {isFailed && (
          <Button
            variant="secondary"
            size="xs"
            onClick={() => onReconnect(account)}
          >
            <Icon name="refresh" size={13} /> Reconnect
          </Button>
        )}
        {isManual ? (
          <Button
            variant="danger"
            size="xs"
            onClick={() => onRemove(account)}
          >
            <Icon name="trash" size={13} /> Remove
          </Button>
        ) : (
          <Button
            variant="danger"
            size="xs"
            onClick={() => onUnlink(account)}
          >
            <Icon name="trash" size={13} /> Unlink
          </Button>
        )}
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
  const [updateItemId, setUpdateItemId] = useState(null); // set → Plaid Link runs in update mode
  const [linkLoading, setLinkLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Banks whose refresh failed with ITEM_LOGIN_REQUIRED, from the backend's
  // refresh-balances response: [{ itemId, institution, error }] (shape-tolerant).
  const [failedItems, setFailedItems] = useState([]);

  // Unlink / remove confirmation: { account, isManual }
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmError, setConfirmError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const failedIds = new Set(
    failedItems.map((f) => (typeof f === 'string' ? f : f.itemId))
  );

  // Fetch a link_token when user clicks "Connect Account".
  // Pass an existing itemId to enter update mode (reconnect a failed bank).
  const startPlaidLink = async (itemId) => {
    setErrorMsg('');
    setLinkLoading(true);
    setUpdateItemId(itemId || null);
    try {
      const data = await api.plaid.createLinkToken(itemId);
      setLinkToken(data.link_token);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to start bank linking');
      setLinkLoading(false);
      setUpdateItemId(null);
    }
  };

  // Called by Plaid when the user finishes the Link flow
  const onPlaidSuccess = useCallback(
    async (publicToken, metadata) => {
      setLinkLoading(false);
      setLinkToken(null);
      const updatingItemId = updateItemId;
      setUpdateItemId(null);
      setSyncing(true);
      setErrorMsg('');
      try {
        if (updatingItemId) {
          // Update mode: the user re-authenticated an existing item.
          // Nothing to exchange — just re-pull data and clear the warning.
          try {
            await api.plaid.syncTransactions();
          } catch (syncErr) {
            console.warn('Sync warning:', syncErr.message);
          }
          if (loadData) await loadData();
          else if (refreshAccounts) await refreshAccounts();
          setFailedItems((prev) =>
            prev.filter((f) => (typeof f === 'string' ? f : f.itemId) !== updatingItemId)
          );
          flash(
            `${metadata?.institution?.name || 'Bank'} reconnected. Balances and transactions are syncing.`
          );
        } else {
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

          const bankName = metadata?.institution?.name || 'Bank';
          flash(`${bankName} linked successfully. Transactions synced.`);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to link bank');
      } finally {
        setSyncing(false);
      }
    },
    [loadData, refreshAccounts, updateItemId]
  );

  const onPlaidExit = useCallback(() => {
    setLinkLoading(false);
    setLinkToken(null);
    setUpdateItemId(null);
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
      const data = await api.plaid.refreshBalances();
      // Backend reports banks that need re-authentication here.
      setFailedItems(
        Array.isArray(data?.failed) ? data.failed : []
      );
      try {
        await api.plaid.syncTransactions();
      } catch (syncErr) {
        console.warn('Sync warning:', syncErr.message);
      }
      if (loadData) await loadData();
      if (Array.isArray(data?.failed) && data.failed.length > 0) {
        flash('Balances refreshed, but some banks need to be reconnected.');
      } else {
        flash('Balances and transactions refreshed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Refresh failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleUnlink = (account) => {
    setConfirmError('');
    setConfirmTarget({ account, isManual: false });
  };

  const handleRemove = (account) => {
    setConfirmError('');
    setConfirmTarget({ account, isManual: true });
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget) return;
    const { account, isManual } = confirmTarget;
    setConfirmError('');
    setActionLoading(true);
    try {
      if (isManual) {
        await api.accounts.deleteManual(account.id || account._id);
        await loadData();
        flash(`"${account.name}" removed.`);
      } else {
        await api.plaid.unlinkItem(account.itemId);
        await loadData();
        setFailedItems((prev) =>
          prev.filter(
            (f) => (typeof f === 'string' ? f : f.itemId) !== account.itemId
          )
        );
        flash(`${account.institution || account.name} disconnected.`);
      }
      setConfirmTarget(null);
    } catch (err) {
      setConfirmError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
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
            onClick={() => startPlaidLink()}
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

      {/* Banks that need re-authentication */}
      {failedItems.length > 0 && (
        <div className="px-4 py-3 bg-warning/10 border border-warning/30 rounded-xl text-sm space-y-2">
          {failedItems.map((f) => {
            const itemId = typeof f === 'string' ? f : f.itemId;
            const name =
              (typeof f === 'object' && (f.institution || f.institutionName)) ||
              'A linked bank';
            return (
              <div
                key={itemId}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="text-warning flex items-center gap-2">
                  <Icon name="alertTriangle" size={16} />
                  {name} needs to be reconnected.
                  {typeof f === 'object' && f.error && (
                    <span className="text-text-muted text-xs">({f.error})</span>
                  )}
                </span>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => startPlaidLink(itemId)}
                  disabled={linkLoading || syncing}
                >
                  <Icon name="refresh" size={13} /> Reconnect
                </Button>
              </div>
            );
          })}
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
            onClick={() => startPlaidLink()}
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
              isFailed={!!acc.itemId && failedIds.has(acc.itemId)}
              onUnlink={handleUnlink}
              onRemove={handleRemove}
              onReconnect={(a) => startPlaidLink(a.itemId)}
            />
          ))}
        </div>
      )}

      {/* Unlink / remove confirmation */}
      <Modal
        isOpen={!!confirmTarget}
        onClose={() => !actionLoading && setConfirmTarget(null)}
        title={
          confirmTarget?.isManual
            ? 'Remove manual account'
            : `Disconnect ${confirmTarget?.account?.institution || 'bank'}?`
        }
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-danger/10 border border-danger/30 rounded-xl">
            <Icon name="alertTriangle" size={18} className="text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              {confirmTarget?.isManual ? (
                <>
                  Remove <span className="font-semibold text-text-main">"{confirmTarget?.account?.name}"</span>?
                  Its transaction history will be permanently deleted.
                </>
              ) : (
                <>
                  This disconnects the bank at Plaid and permanently deletes
                  every account and transaction imported from it.{' '}
                  <span className="font-semibold text-text-main">
                    This cannot be undone.
                  </span>
                </>
              )}
            </p>
          </div>

          {confirmError && (
            <p className="text-sm text-danger flex items-center gap-2">
              <Icon name="alertCircle" size={15} /> {confirmError}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setConfirmTarget(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading
                ? 'Working…'
                : confirmTarget?.isManual
                ? 'Remove account'
                : 'Disconnect bank'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountsPage;
