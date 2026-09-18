import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext.jsx';

const FEATURES = [
  {
    icon: '📊',
    title: 'Expense Tracking',
    desc: 'Track every rupee across all your accounts with smart categorization.',
  },
  {
    icon: '🎯',
    title: 'Budget Management',
    desc: 'Set monthly budgets by category and get alerts before you overspend.',
  },
  {
    icon: '📈',
    title: 'Financial Analytics',
    desc: 'Understand patterns in your spending with rich interactive charts.',
  },
  {
    icon: '🏦',
    title: 'Account Management',
    desc: 'Connect all your banks and cards in one unified, secure dashboard.',
  },
];

const LandingPage = () => {
  const { setCurrentPage } = useFinance();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-deep text-text-main overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span className="font-bold text-base text-text-main">PFM <span className="text-brand-purple">Dashboard</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('login')}
              className="text-sm font-medium text-text-secondary hover:text-text-main transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="btn-primary text-sm py-2 px-5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden p-2 text-text-muted hover:text-text-main"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-navy-secondary px-4 py-4 flex flex-col gap-3 animate-slide-up">
            <button onClick={() => setCurrentPage('login')} className="btn-secondary text-sm w-full">Login</button>
            <button onClick={() => setCurrentPage('register')} className="btn-primary text-sm w-full">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-brand-mint/5 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-xs font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse" />
            Personal Finance Management Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Understand your money.<br />
            <span className="text-brand-purple">Plan your future.</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Track spending, manage budgets, and understand your financial habits from one simple, powerful dashboard built for modern India.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setCurrentPage('register')}
              className="btn-primary px-8 py-3 text-base"
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="btn-secondary px-8 py-3 text-base"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Stats Row */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { label: 'Users', value: '10K+' },
              { label: 'Transactions', value: '2M+' },
              { label: 'Saved Monthly', value: '₹15K avg' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-brand-purple">{s.value}</div>
                <div className="text-xs text-text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-navy-secondary p-4 sm:p-6 shadow-2xl animate-slide-up">
            {/* Fake dashboard preview */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-text-main">Good morning, Sana 👋</div>
                <div className="text-sm text-text-secondary">Here's your financial overview for September 2026</div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Balance', value: '₹2,48,750', change: '+12.4%', color: 'text-brand-purple' },
                { label: 'Monthly Income', value: '₹1,45,000', change: '+8.1%', color: 'text-income' },
                { label: 'Monthly Expenses', value: '₹82,650', change: '-3.5%', color: 'text-expense' },
                { label: 'Savings', value: '₹62,350', change: '+22.8%', color: 'text-success' },
              ].map(card => (
                <div key={card.label} className="card p-3 sm:p-4">
                  <p className="text-xs text-text-muted mb-1.5">{card.label}</p>
                  <p className={`text-base sm:text-lg font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-success mt-0.5">{card.change}</p>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 card p-4 h-32 sm:h-40 flex items-end gap-2 overflow-hidden">
                {[65, 78, 58, 85, 72, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                    <div className="w-full rounded-t-sm bg-brand-purple/60" style={{ height: `${h * 0.8}%` }} />
                    <div className="w-full rounded-t-sm bg-expense/40" style={{ height: `${(100 - h) * 0.55}%` }} />
                  </div>
                ))}
              </div>
              <div className="card p-4 flex flex-col gap-2 justify-center">
                {[
                  { name: 'Food', pct: 80, color: '#2DD4BF' },
                  { name: 'Transport', pct: 64, color: '#FBBF24' },
                  { name: 'Entertainment', pct: 109, color: '#FB7185' },
                ].map(b => (
                  <div key={b.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{b.name}</span>
                      <span className={b.pct > 100 ? 'text-danger' : 'text-text-muted'}>{b.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-navy-deep rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(b.pct, 100)}%`, backgroundColor: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-secondary to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-navy-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-3">Everything you need to master your finances</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              A complete personal finance platform designed for the modern professional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card p-5 hover:card-elevated hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-base font-semibold text-text-main mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-purple/5 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">Start managing your money today</h2>
          <p className="text-text-secondary mb-8 text-lg">
            Join thousands of people who have taken control of their financial future.
          </p>
          <button
            onClick={() => setCurrentPage('register')}
            className="btn-primary px-10 py-4 text-base"
          >
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 text-center text-text-muted text-sm">
        <p>© 2026 PFM Dashboard · Personal Finance Management Platform · Built with React + Vite + Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default LandingPage;
