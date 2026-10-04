// Comprehensive Realistic Mock Data for Personal Finance Management (PFM) Dashboard
// Designed to be easily replaced by Node/Express/MongoDB/Plaid API responses

export const initialUser = {
  id: 'usr_001',
  name: 'Alex Johnson',
  email: 'alex.johnson@finflow.dev',
  role: 'Software Engineer',
  phone: '+91 98765 43210',
  currency: '₹',
  joinedDate: 'January 2024',
  avatarUrl: null, // Will use initials AJ
  preferences: {
    budgetAlerts: true,
    weeklyReport: true,
    largeTransactionAlerts: true,
    emailNotifications: true,
    twoFactorAuth: true,
  }
};

export const initialAccounts = [
  {
    id: 'acc_01',
    name: 'HDFC Corporate Salary',
    institution: 'HDFC Bank',
    type: 'Checking',
    accountNumber: '•••• 4892',
    balance: 142500,
    availableBalance: 142500,
    currency: '₹',
    status: 'Connected',
    lastSync: '10 mins ago',
    color: '#2563EB',
    isPrimary: true,
  },
  {
    id: 'acc_02',
    name: 'ICICI Wealth Savings',
    institution: 'ICICI Bank',
    type: 'Savings',
    accountNumber: '•••• 1039',
    balance: 85250,
    availableBalance: 85250,
    currency: '₹',
    status: 'Connected',
    lastSync: '1 hour ago',
    color: '#14B8A6',
    isPrimary: false,
  },
  {
    id: 'acc_03',
    name: 'SBI Prime Black Credit Card',
    institution: 'State Bank of India',
    type: 'Credit Card',
    accountNumber: '•••• 9421',
    balance: -18400,
    creditLimit: 150000,
    availableBalance: 131600,
    currency: '₹',
    status: 'Connected',
    lastSync: '25 mins ago',
    color: '#DC2626',
    isPrimary: false,
  },
  {
    id: 'acc_04',
    name: 'Zerodha Demat Liquid',
    institution: 'Zerodha Broking',
    type: 'Investment',
    accountNumber: '•••• 7712',
    balance: 39400,
    availableBalance: 39400,
    currency: '₹',
    status: 'Connected',
    lastSync: 'Today at 09:30 AM',
    color: '#F59E0B',
    isPrimary: false,
  },
];

export const initialSummary = {
  totalBalance: 248750,
  totalIncome: 145000,
  totalExpenses: 82650,
  savings: 62350,
  balanceChange: '+12.4%',
  incomeChange: '+8.1%',
  expenseChange: '-3.5%',
  savingsChange: '+22.8%',
  period: 'vs. last month'
};

export const expenseCategories = [
  { name: 'Food', color: '#2563EB', icon: 'food' },
  { name: 'Shopping', color: '#14B8A6', icon: 'shopping' },
  { name: 'Transport', color: '#F59E0B', icon: 'transport' },
  { name: 'Bills', color: '#DC2626', icon: 'bills' },
  { name: 'Entertainment', color: '#8B5CF6', icon: 'entertainment' },
  { name: 'Healthcare', color: '#10B981', icon: 'healthcare' },
  { name: 'Other', color: '#64748B', icon: 'other' }
];

export const expenseByCategoryData = [
  { name: 'Food', value: 24500, color: '#2563EB', percentage: 29.6 },
  { name: 'Shopping', value: 16800, color: '#14B8A6', percentage: 20.3 },
  { name: 'Bills', value: 15400, color: '#DC2626', percentage: 18.6 },
  { name: 'Transport', value: 9200, color: '#F59E0B', percentage: 11.1 },
  { name: 'Entertainment', value: 7500, color: '#8B5CF6', percentage: 9.1 },
  { name: 'Healthcare', value: 5200, color: '#10B981', percentage: 6.3 },
  { name: 'Other', value: 4050, color: '#64748B', percentage: 4.9 }
];

export const incomeVsExpenseHistory = [
  { month: 'Jan', income: 125000, expenses: 74000, savings: 51000 },
  { month: 'Feb', income: 130000, expenses: 78500, savings: 51500 },
  { month: 'Mar', income: 128000, expenses: 81000, savings: 47000 },
  { month: 'Apr', income: 135000, expenses: 76200, savings: 58800 },
  { month: 'May', income: 140000, expenses: 85400, savings: 54600 },
  { month: 'Jun', income: 145000, expenses: 82650, savings: 62350 }
];

export const spendingTrendData = [
  { week: 'Week 1', spent: 18200, average: 20000 },
  { week: 'Week 2', spent: 22400, average: 20000 },
  { week: 'Week 3', spent: 19800, average: 20000 },
  { week: 'Week 4', spent: 22250, average: 20000 }
];

export const initialBudgets = [
  {
    id: 'bgt_01',
    category: 'Food',
    limit: 5000,
    spent: 4200,
    notes: 'Groceries, dining out, and weekend food delivery',
    color: '#2563EB'
  },
  {
    id: 'bgt_02',
    category: 'Shopping',
    limit: 3500,
    spent: 2000,
    notes: 'Clothing, personal care, and gadgets',
    color: '#14B8A6'
  },
  {
    id: 'bgt_03',
    category: 'Transport',
    limit: 2500,
    spent: 1800,
    notes: 'Fuel, metro cards, and cab rides',
    color: '#F59E0B'
  },
  {
    id: 'bgt_04',
    category: 'Bills',
    limit: 4000,
    spent: 3200,
    notes: 'Electricity, fiber broadband, mobile recharges',
    color: '#DC2626'
  },
  {
    id: 'bgt_05',
    category: 'Entertainment',
    limit: 2000,
    spent: 1250,
    notes: 'Movie tickets, streaming subscriptions, games',
    color: '#8B5CF6'
  },
  {
    id: 'bgt_06',
    category: 'Healthcare',
    limit: 1500,
    spent: 800,
    notes: 'Doctor visits, vitamins, pharmacy items',
    color: '#10B981'
  }
];

export const initialTransactions = [
  {
    id: 'tx_001',
    date: '2026-06-08',
    description: 'FreshMart Organic Groceries',
    category: 'Food',
    account: 'HDFC Corporate Salary',
    amount: 1450,
    type: 'expense',
    status: 'Completed',
    notes: 'Weekly pantry restock'
  },
  {
    id: 'tx_002',
    date: '2026-06-07',
    description: 'TechCorp Monthly Salary Credit',
    category: 'Salary',
    account: 'HDFC Corporate Salary',
    amount: 145000,
    type: 'income',
    status: 'Completed',
    notes: 'June salary payout after deductions'
  },
  {
    id: 'tx_003',
    date: '2026-06-06',
    description: 'Amazon Prime Electronics',
    category: 'Shopping',
    account: 'SBI Prime Black Credit Card',
    amount: 3299,
    type: 'expense',
    status: 'Completed',
    notes: 'USB-C hub and mechanical keyboard switch'
  },
  {
    id: 'tx_004',
    date: '2026-06-05',
    description: 'Airtel Fiber Broadband Bill',
    category: 'Bills',
    account: 'ICICI Wealth Savings',
    amount: 1180,
    type: 'expense',
    status: 'Completed',
    notes: '1 Gbps home internet plan'
  },
  {
    id: 'tx_005',
    date: '2026-06-04',
    description: 'Uber Business Commute',
    category: 'Transport',
    account: 'HDFC Corporate Salary',
    amount: 480,
    type: 'expense',
    status: 'Completed',
    notes: 'Client office meeting commute'
  },
  {
    id: 'tx_006',
    date: '2026-06-03',
    description: 'Freelance UI/UX Consulting',
    category: 'Freelance',
    account: 'ICICI Wealth Savings',
    amount: 22000,
    type: 'income',
    status: 'Completed',
    notes: 'Milestone 2 payment for SaaS redesign'
  },
  {
    id: 'tx_007',
    date: '2026-06-02',
    description: 'Apollo Pharmacy Medicines',
    category: 'Healthcare',
    account: 'SBI Prime Black Credit Card',
    amount: 620,
    type: 'expense',
    status: 'Completed',
    notes: 'Routine health check supplements'
  },
  {
    id: 'tx_008',
    date: '2026-06-01',
    description: 'Netflix & Spotify Premium',
    category: 'Entertainment',
    account: 'SBI Prime Black Credit Card',
    amount: 999,
    type: 'expense',
    status: 'Completed',
    notes: 'Monthly digital entertainment pack'
  },
  {
    id: 'tx_009',
    date: '2026-05-30',
    description: 'Shell Express High Octane Fuel',
    category: 'Transport',
    account: 'HDFC Corporate Salary',
    amount: 2800,
    type: 'expense',
    status: 'Completed',
    notes: 'Car tank refill for road trip'
  },
  {
    id: 'tx_010',
    date: '2026-05-28',
    description: 'Zara Summer Apparel',
    category: 'Shopping',
    account: 'SBI Prime Black Credit Card',
    amount: 4500,
    type: 'expense',
    status: 'Completed',
    notes: 'Casual shirts and trousers'
  },
  {
    id: 'tx_011',
    date: '2026-05-25',
    description: 'Quarterly Equity Dividend',
    category: 'Investment',
    account: 'Zerodha Demat Liquid',
    amount: 4350,
    type: 'income',
    status: 'Completed',
    notes: 'TCS & Infosys dividend credit'
  },
  {
    id: 'tx_012',
    date: '2026-05-22',
    description: 'Blue Tokai Specialty Coffee',
    category: 'Food',
    account: 'HDFC Corporate Salary',
    amount: 550,
    type: 'expense',
    status: 'Completed',
    notes: 'Artisan roast beans'
  },
  {
    id: 'tx_013',
    date: '2026-05-20',
    description: 'State Electricity Board',
    category: 'Bills',
    account: 'ICICI Wealth Savings',
    amount: 2450,
    type: 'expense',
    status: 'Completed',
    notes: 'May power utility bill'
  },
  {
    id: 'tx_014',
    date: '2026-05-18',
    description: 'PVR IMAX Movie & Snacks',
    category: 'Entertainment',
    account: 'SBI Prime Black Credit Card',
    amount: 1400,
    type: 'expense',
    status: 'Completed',
    notes: 'Weekend movie premiere with friends'
  },
  {
    id: 'tx_015',
    date: '2026-05-15',
    description: 'Decathlon Gym Equipment',
    category: 'Shopping',
    account: 'HDFC Corporate Salary',
    amount: 3200,
    type: 'expense',
    status: 'Completed',
    notes: 'Resistance bands and kettlebell'
  }
];

export const plaidMockBanks = [
  { id: 'hdfc', name: 'HDFC Bank', logoColor: '#004c8f', popular: true },
  { id: 'icici', name: 'ICICI Bank', logoColor: '#a9211c', popular: true },
  { id: 'sbi', name: 'State Bank of India', logoColor: '#0070bc', popular: true },
  { id: 'axis', name: 'Axis Bank', logoColor: '#97144d', popular: true },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logoColor: '#ed1c24', popular: true },
  { id: 'chase', name: 'Chase Bank (US)', logoColor: '#117ACA', popular: false },
  { id: 'citi', name: 'Citibank N.A.', logoColor: '#003B70', popular: false }
];
