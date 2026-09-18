// API Service Layer
// Cleanly structured to connect to future Node.js + Express.js backend & MongoDB database
// Base URL can be configured via environment variable (e.g. import.meta.env.VITE_API_BASE_URL)

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to simulate minor network latency for realistic loading states
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Authentication Endpoints
  auth: {
    // POST /api/auth/login
    async login(credentials) {
      await delay(400);
      if (credentials.email && credentials.password) {
        return {
          success: true,
          token: 'jwt_mock_token_sample_abc123',
          user: {
            ...initialUser,
            email: credentials.email,
            name: credentials.email.split('@')[0].replace('.', ' ')
          }
        };
      }
      throw new Error('Please enter valid email and password.');
    },

    // POST /api/auth/register
    async register(userData) {
      await delay(500);
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Please fill in all required fields.');
      }
      return {
        success: true,
        token: 'jwt_mock_token_sample_reg789',
        user: {
          ...initialUser,
          name: userData.name,
          email: userData.email
        }
      };
    },

    // POST /api/auth/logout
    async logout() {
      await delay(200);
      return { success: true };
    }
  },

  // Accounts Endpoints
  accounts: {
    // GET /api/accounts
    async getAccounts() {
      await delay(300);
      return [...initialAccounts];
    },

    // POST /api/accounts
    async createAccount(accountData) {
      await delay(350);
      return {
        id: `acc_${Date.now()}`,
        status: 'Connected',
        lastSync: 'Just now',
        currency: '₹',
        ...accountData
      };
    },

    // POST /api/accounts/plaid/link-token (Future Plaid API placeholder)
    async createPlaidLinkToken() {
      await delay(300);
      return { link_token: 'link-sandbox-mock-plaid-token-12345' };
    },

    // POST /api/accounts/plaid/exchange (Future Plaid API placeholder)
    async exchangePlaidPublicToken(publicToken, metadata) {
      await delay(800);
      return {
        success: true,
        accountsConnected: metadata.accounts?.length || 1
      };
    }
  },

  // Transactions Endpoints
  transactions: {
    // GET /api/transactions
    async getTransactions(filters = {}) {
      await delay(300);
      return [...initialTransactions];
    },

    // POST /api/transactions
    async createTransaction(transactionData) {
      await delay(400);
      return {
        id: `tx_${Date.now()}`,
        status: 'Completed',
        ...transactionData
      };
    },

    // DELETE /api/transactions/:id
    async deleteTransaction(id) {
      await delay(300);
      return { success: true, id };
    }
  },

  // Budgets Endpoints
  budgets: {
    // GET /api/budgets
    async getBudgets() {
      await delay(300);
      return [...initialBudgets];
    },

    // POST /api/budgets
    async createBudget(budgetData) {
      await delay(350);
      return {
        id: `bgt_${Date.now()}`,
        spent: 0,
        ...budgetData
      };
    },

    // PUT /api/budgets/:id
    async updateBudget(id, updateData) {
      await delay(300);
      return {
        id,
        ...updateData
      };
    },

    // DELETE /api/budgets/:id
    async deleteBudget(id) {
      await delay(250);
      return { success: true, id };
    }
  },

  // Analytics Endpoints
  analytics: {
    // GET /api/analytics
    async getAnalytics(period = '6months') {
      await delay(350);
      return {
        summary: initialSummary,
        incomeVsExpense: incomeVsExpenseHistory,
        categorySpending: expenseByCategoryData,
        spendingTrend: spendingTrendData
      };
    }
  }
};

export default api;
