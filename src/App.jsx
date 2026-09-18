import { FinanceProvider, useFinance } from './context/FinanceContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Layout from './components/layout/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function AppRouter() {
  const { currentPage, isAuthenticated } = useFinance();

  // Public pages
  if (currentPage === 'landing') return <LandingPage />;
  if (currentPage === 'login') return <LoginPage />;
  if (currentPage === 'register') return <RegisterPage />;

  // Protected pages — require auth
  if (!isAuthenticated) return <LandingPage />;

  const pageMap = {
    dashboard: <DashboardPage />,
    transactions: <TransactionsPage />,
    accounts: <AccountsPage />,
    budget: <BudgetPage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <Layout>
      {pageMap[currentPage] || <DashboardPage />}
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppRouter />
    </FinanceProvider>
  );
}

export default App;
