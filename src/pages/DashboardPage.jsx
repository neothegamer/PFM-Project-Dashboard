import React from 'react';
import { useFinance } from '../context/FinanceContext.jsx';
import SummaryCard from '../components/dashboard/SummaryCard.jsx';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart.jsx';
import ExpenseOverview from '../components/dashboard/ExpenseOverview.jsx';
import BudgetOverview from '../components/dashboard/BudgetOverview.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';

const DashboardPage = () => {
  const { user, summary, categorySpending, incomeVsExpenseHistory, budgets, transactions, formatCurrency } = useFinance();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const summaryCards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.totalBalance),
      change: summary.balanceChange,
      positive: true,
      icon: 'wallet',
      color: 'bg-brand-purple/15 text-brand-purple',
      delay: 0.05,
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summary.totalIncome),
      change: summary.incomeChange,
      positive: true,
      icon: 'trendingUp',
      color: 'bg-income/15 text-income',
      delay: 0.1,
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary.totalExpenses),
      change: summary.expenseChange,
      positive: false,
      icon: 'trendingDown',
      color: 'bg-expense/15 text-expense',
      delay: 0.15,
    },
    {
      title: 'Net Savings',
      value: formatCurrency(summary.savings),
      change: summary.savingsChange,
      positive: true,
      icon: 'arrowUp',
      color: 'bg-success/15 text-success',
      delay: 0.2,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-main">
          {greeting}, {firstName} 👋
        </h2>
        <p className="text-text-secondary mt-1">Here's your financial overview for {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={incomeVsExpenseHistory} />
        </div>
        <div>
          <ExpenseOverview data={categorySpending} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentTransactions transactions={transactions} />
        <BudgetOverview budgets={budgets} />
      </div>
    </div>
  );
};

export default DashboardPage;
