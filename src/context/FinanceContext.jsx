import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import {
  initialUser,
  initialAccounts,
  initialBudgets,
  initialTransactions,
  initialSummary,
  expenseByCategoryData,
  incomeVsExpenseHistory,
  spendingTrendData
} from '../data/mockData';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  // Navigation State
  // Possible values: 'landing', 'login', 'register', 'dashboard', 'transactions', 'accounts', 'budget', 'analytics', 'settings'
  const getInitialPage = () => {
  const hash = window.location.hash.replace('#', '');

  const validPages = [
    'landing',
    'login',
    'register',
    'dashboard',
    'transactions',
    'accounts',
    'budget',
    'analytics',
    'settings'
  ];

  return validPages.includes(hash) ? hash : 'landing';
};

const [currentPage, setCurrentPageState] = useState(getInitialPage);
// Browser history navigation
const setCurrentPage = useCallback((page, options = {}) => {
  const { replace = false } = options;

  setCurrentPageState(page);

  if (replace) {
    window.history.replaceState(
      { page },
      '',
      `#${page}`
    );
  } else {
    window.history.pushState(
      { page },
      '',
      `#${page}`
    );
  }
}, []);

// Handle browser Back / Forward buttons
useEffect(() => {
  // Set initial browser history state
  const currentHash = window.location.hash.replace('#', '');

  if (!currentHash) {
    window.history.replaceState(
      { page: currentPage },
      '',
      `#${currentPage}`
    );
  }

  const handlePopState = () => {
    const hash = window.location.hash.replace('#', '');

    const validPages = [
      'landing',
      'login',
      'register',
      'dashboard',
      'transactions',
      'accounts',
      'budget',
      'analytics',
      'settings'
    ];

    if (validPages.includes(hash)) {
      setCurrentPageState(hash);
    } else {
      setCurrentPageState('landing');
    }
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [currentPage]);
  // Auth State
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Financial Data State
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [currency, setCurrency] = useState('₹');

  // Dynamic calculations for Financial Summary
  const summary = useMemo(() => {
    // Calculate total balance from active accounts
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

    // Calculate total income from transactions
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    // Calculate total expenses from transactions
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const savings = totalIncome - totalExpenses;

    return {
      totalBalance: totalBalance > 0 ? totalBalance : initialSummary.totalBalance,
      totalIncome: totalIncome > 0 ? totalIncome : initialSummary.totalIncome,
      totalExpenses: totalExpenses > 0 ? totalExpenses : initialSummary.totalExpenses,
      savings: savings > 0 ? savings : initialSummary.savings,
      balanceChange: initialSummary.balanceChange,
      incomeChange: initialSummary.incomeChange,
      expenseChange: initialSummary.expenseChange,
      savingsChange: initialSummary.savingsChange,
      period: initialSummary.period
    };
  }, [accounts, transactions]);

  // Dynamic calculation for Category Spending (derived from current transactions)
  const categorySpending = useMemo(() => {
    const expenseTx = transactions.filter(t => t.type === 'expense');
    const totalSpent = expenseTx.reduce((sum, t) => sum + t.amount, 0);

    if (totalSpent === 0) return expenseByCategoryData;

    const catMap = {};
    expenseTx.forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    const categoryColors = {
      Food: '#2563EB',
      Shopping: '#14B8A6',
      Bills: '#DC2626',
      Transport: '#F59E0B',
      Entertainment: '#8B5CF6',
      Healthcare: '#10B981',
      Other: '#64748B'
    };

    return Object.keys(catMap).map(cat => ({
      name: cat,
      value: catMap[cat],
      color: categoryColors[cat] || '#64748B',
      percentage: Number(((catMap[cat] / totalSpent) * 100).toFixed(1))
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Actions: Transactions
  const addTransaction = (newTx) => {
    const tx = {
      id: `tx_${Date.now()}`,
      status: 'Completed',
      ...newTx,
      amount: Number(newTx.amount)
    };
    setTransactions(prev => [tx, ...prev]);

    // Also update budget spent if it matches category
    if (tx.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category.toLowerCase() === tx.category.toLowerCase()) {
          return { ...b, spent: b.spent + tx.amount };
        }
        return b;
      }));
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Actions: Budgets
  const addBudget = (newBudget) => {
    const budget = {
      id: `bgt_${Date.now()}`,
      spent: 0,
      color: '#2563EB',
      ...newBudget,
      limit: Number(newBudget.limit)
    };
    setBudgets(prev => [...prev, budget]);
  };

  const updateBudget = (id, updated) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updated, limit: Number(updated.limit) } : b));
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Actions: Accounts
  const addAccount = (newAcc) => {
    const acc = {
      id: `acc_${Date.now()}`,
      status: 'Connected',
      lastSync: 'Just now',
      currency,
      color: '#2563EB',
      ...newAcc,
      balance: Number(newAcc.balance)
    };
    setAccounts(prev => [...prev, acc]);
  };

  // Auth Helpers
  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return `${currency}0`;
    const absVal = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(absVal);

    if (amount < 0) return `-${currency}${formatted}`;
    return `${currency}${formatted}`;
  };

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
        summary,
        categorySpending,
        incomeVsExpenseHistory,
        spendingTrendData,
        currency,
        setCurrency,
        formatCurrency
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
