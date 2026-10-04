import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import api from '../services/api.js';

const FinanceContext = createContext(null);

// ─── Helpers: map backend → UI shape ─────────────────────────────

function mapAccount(a) {
  return {
    id: a._id || a.id,
    _id: a._id || a.id,
    name: a.name || a.officialName || 'Account',
    institution: a.institutionName || a.institution || '',
    type: a.subtype || a.type || 'Checking',
    accountNumber: a.mask ? `•••• ${a.mask}` : '••••',
    balance: a.currentBalance ?? a.balance ?? 0,
    availableBalance: a.availableBalance ?? a.currentBalance ?? 0,
    currency: a.isoCurrencyCode === 'USD' ? '$' : '₹',
    status: 'Connected',
    lastSync: 'Just now',
    color: '#8B5CF6',
    plaidAccountId: a.plaidAccountId,
    mask: a.mask,
  };
}

function mapTransaction(t) {
  const amount = Number(t.amount) || 0;
  const isIncome = amount < 0;
  return {
    id: t._id || t.id,
    _id: t._id || t.id,
    description: t.name || t.description || '',
    name: t.name || t.description || '',
    amount: Math.abs(amount),
    type: isIncome ? 'income' : 'expense',
    category: t.category || 'Other',
    account: t.account,
    accountId: t.account,
    date: t.date,
    status: 'Completed',
    notes: t.notes || '',
    isManual: t.isManual,
    isEdited: t.isEdited,
  };
}

function mapBudget(b, statusItem) {
  return {
    id: b._id || b.id || b.category,
    _id: b._id || b.id,
    category: b.category,
    limit: b.monthlyLimit ?? b.limit ?? 0,
    spent: statusItem?.spent ?? statusItem?.actual ?? b.spent ?? 0,
    notes: b.notes || '',
    color: b.color || '#8B5CF6',
  };
}

// ─── Provider ────────────────────────────────────────────────────

export const FinanceProvider = ({ children }) => {
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    const valid = [
      'landing',
      'login',
      'register',
      'dashboard',
      'transactions',
      'accounts',
      'budget',
      'analytics',
      'settings',
    ];
    return valid.includes(hash) ? hash : 'landing';
  };

  const [currentPage, setCurrentPageState] = useState(getInitialPage);

  const setCurrentPage = useCallback((page, options = {}) => {
    const { replace = false } = options;
    setCurrentPageState(page);
    if (replace) {
      window.history.replaceState({ page }, '', `#${page}`);
    } else {
      window.history.pushState({ page }, '', `#${page}`);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const valid = [
        'landing',
        'login',
        'register',
        'dashboard',
        'transactions',
        'accounts',
        'budget',
        'analytics',
        'settings',
      ];
      setCurrentPageState(valid.includes(hash) ? hash : 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthSummary, setMonthSummary] = useState([]);
  const [currency, setCurrency] = useState('₹');
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  // ─── Load all data ─────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!api.getToken()) return;
    setDataLoading(true);
    setDataError('');
    try {
      const [accRes, txRes, budgetRes, statusRes, catRes, monthRes] =
        await Promise.allSettled([
          api.plaid.getAccounts(),
          api.transactions.getTransactions({ limit: 200 }),
          api.budgets.getBudgets(),
          api.budgets.getStatus(),
          api.transactions.summaryByCategory(),
          api.transactions.summaryByMonth(),
        ]);

      if (accRes.status === 'fulfilled') {
        const list = accRes.value.accounts || accRes.value || [];
        setAccounts(Array.isArray(list) ? list.map(mapAccount) : []);
      } else {
        setAccounts([]);
      }

      if (txRes.status === 'fulfilled') {
        const list = txRes.value.transactions || txRes.value || [];
        setTransactions(Array.isArray(list) ? list.map(mapTransaction) : []);
      } else {
        setTransactions([]);
      }

      // Budgets + status (this is where mapBudget is used)
      let budgetList = [];
      if (budgetRes.status === 'fulfilled') {
        budgetList = budgetRes.value.budgets || budgetRes.value || [];
        if (!Array.isArray(budgetList)) budgetList = [];
      }
      let statusList = [];
      if (statusRes.status === 'fulfilled') {
        statusList = statusRes.value.status || statusRes.value || [];
        if (!Array.isArray(statusList)) statusList = [];
      }
      setBudgets(
        budgetList.map((b) => {
          const st = statusList.find(
            (s) => s.category === b.category || s._id === b.category
          );
          return mapBudget(b, st);
        })
      );

      if (catRes.status === 'fulfilled') {
        const summary = catRes.value.summary || catRes.value || [];
        setCategorySummary(
          Array.isArray(summary)
            ? summary.map((s) => ({
                name: s._id || s.name || s.category,
                value: s.total ?? s.value ?? 0,
                color: '#8B5CF6',
              }))
            : []
        );
      } else {
        setCategorySummary([]);
      }

      if (monthRes.status === 'fulfilled') {
        const summary = monthRes.value.summary || monthRes.value || [];
        setMonthSummary(Array.isArray(summary) ? summary : []);
      } else {
        setMonthSummary([]);
      }
    } catch (err) {
      console.error('loadData error', err);
      setDataError(err.message || 'Failed to load data');
      setAccounts([]);
      setTransactions([]);
      setBudgets([]);
      setCategorySummary([]);
      setMonthSummary([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // ─── Session restore ───────────────────────────────────────────
  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setAuthChecked(true);
      return;
    }

    (async () => {
      try {
        const data = await api.auth.me();
        const u = data.user || data;
        setUser({
          id: u._id || u.id,
          name: u.name,
          email: u.email,
        });
        setIsAuthenticated(true);
        const hash = window.location.hash.replace('#', '');
        if (
          !hash ||
          hash === 'landing' ||
          hash === 'login' ||
          hash === 'register'
        ) {
          setCurrentPage('dashboard', { replace: true });
        }
        await loadData();
      } catch {
        api.clearToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [loadData, setCurrentPage]);

  // ─── Auth ──────────────────────────────────────────────────────
  const loginUser = useCallback(
    async (userData) => {
      setUser(userData);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      await loadData();
    },
    [loadData, setCurrentPage]
  );

  const logoutUser = useCallback(() => {
    api.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAccounts([]);
    setTransactions([]);
    setBudgets([]);
    setCategorySummary([]);
    setMonthSummary([]);
    setCurrentPage('landing');
  }, [setCurrentPage]);

  // ─── Transactions ──────────────────────────────────────────────
  const addTransaction = useCallback(
    async (newTx) => {
      const rawAmount = Number(newTx.amount) || 0;
      const amount =
        newTx.type === 'income' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

      try {
        const data = await api.transactions.createTransaction({
          account: newTx.account,
          name: newTx.name || newTx.description,
          amount,
          date: newTx.date,
          category: newTx.category,
          notes: newTx.notes,
        });
        const created = data.transaction || data;
        setTransactions((prev) => [mapTransaction(created), ...prev]);
        await loadData();
        return created;
      } catch (err) {
        console.error('addTransaction failed', err);
        throw err;
      }
    },
    [loadData]
  );

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.transactions.deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((t) => t.id !== id && t._id !== id)
      );
    } catch (err) {
      console.error('deleteTransaction failed', err);
      throw err;
    }
  }, []);

  // ─── Budgets ───────────────────────────────────────────────────
  const addBudget = useCallback(
    async (newBudget) => {
      try {
        await api.budgets.setBudget({
          category: newBudget.category,
          monthlyLimit: Number(newBudget.limit),
          color: newBudget.color,
          notes: newBudget.notes,
        });
        await loadData();
      } catch (err) {
        console.error('addBudget failed', err);
        throw err;
      }
    },
    [loadData]
  );

  const updateBudget = useCallback(
    async (id, updated) => {
      try {
        const existing = budgets.find((b) => b.id === id || b._id === id);
        const category = updated.category || existing?.category;
        await api.budgets.setBudget({
          category,
          monthlyLimit: Number(updated.limit),
          color: updated.color ?? existing?.color,
          notes: updated.notes ?? existing?.notes,
        });
        await loadData();
      } catch (err) {
        console.error('updateBudget failed', err);
        throw err;
      }
    },
    [budgets, loadData]
  );

  const deleteBudget = useCallback(async (id) => {
    try {
      await api.budgets.deleteBudget(id);
      setBudgets((prev) =>
        prev.filter((b) => b.id !== id && b._id !== id)
      );
    } catch (err) {
      console.error('deleteBudget failed', err);
      throw err;
    }
  }, []);

  // ─── Accounts ──────────────────────────────────────────────────
  const addAccount = useCallback((newAcc) => {
    setAccounts((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        ...newAcc,
        balance: Number(newAcc.balance) || 0,
        status: 'Connected',
        lastSync: 'Just now',
      },
    ]);
  }, []);

  const refreshAccounts = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // ─── Derived summary ───────────────────────────────────────────
  const summary = useMemo(() => {
    const totalBalance = accounts.reduce(
      (sum, a) => sum + (Number(a.balance) || 0),
      0
    );
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpenses;

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      savings,
      balanceChange: null,
      incomeChange: null,
      expenseChange: null,
      savingsChange: null,
      period: '',
    };
  }, [accounts, transactions]);

  const categorySpending = useMemo(() => {
    if (categorySummary.length > 0) {
      const total = categorySummary.reduce((s, c) => s + c.value, 0) || 1;
      return categorySummary.map((c) => ({
        ...c,
        percentage: Number(((c.value / total) * 100).toFixed(1)),
      }));
    }
    const expenseTx = transactions.filter((t) => t.type === 'expense');
    const totalSpent = expenseTx.reduce((s, t) => s + t.amount, 0);
    if (totalSpent === 0) return [];
    const catMap = {};
    expenseTx.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    return Object.keys(catMap).map((name) => ({
      name,
      value: catMap[name],
      color: '#8B5CF6',
      percentage: Number(((catMap[name] / totalSpent) * 100).toFixed(1)),
    }));
  }, [categorySummary, transactions]);

  const incomeVsExpenseHistory = useMemo(() => {
    if (monthSummary.length > 0) {
      return monthSummary.map((m) => ({
        month: m.month,
        income: m.income || 0,
        expenses: m.expense || m.expenses || 0,
        savings: (m.income || 0) - (m.expense || m.expenses || 0),
      }));
    }
    return [];
  }, [monthSummary]);

  const formatCurrency = useCallback(
    (amount) => {
      if (amount === undefined || amount === null) return `${currency}0`;
      const absVal = Math.abs(amount);
      const formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0,
      }).format(absVal);
      if (amount < 0) return `-${currency}${formatted}`;
      return `${currency}${formatted}`;
    },
    [currency]
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FinanceContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loginUser,
        logoutUser,
        transactions,
        addTransaction,
        deleteTransaction,
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        accounts,
        addAccount,
        refreshAccounts,
        summary,
        categorySpending,
        incomeVsExpenseHistory,
        spendingTrendData: [],
        currency,
        setCurrency,
        formatCurrency,
        dataLoading,
        dataError,
        loadData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext;