import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Button from '../components/common/Button';
import {
  IconWallet,
  IconTrendingUp,
  IconShield,
  IconTarget,
  IconPieChart,
  IconCheck,
  IconArrowUpRight
} from '../components/common/Icons';

export const Landing = () => {
  const { setCurrentPage } = useFinance();

  const features = [
    {
      icon: IconPieChart,
      title: 'Smart Categorization',
      desc: 'Automatic distribution of your expenses across Food, Bills, Shopping, and Healthcare.',
      color: 'bg-blue-50 text-brand-blue'
    },
    {
      icon: IconTarget,
      title: 'Proactive Budget Limits',
      desc: 'Set custom monthly category budgets with intelligent near-limit and overspend alerts.',
      color: 'bg-teal-50 text-brand-teal'
    },
    {
      icon: IconTrendingUp,
      title: 'Cash Flow Analytics',
      desc: 'Interactive Recharts visualizations mapping income vs expenses and cumulative savings trends.',
      color: 'bg-emerald-50 text-brand-success'
    },
    {
      icon: IconShield,
      title: 'Bank-Grade Security',
      desc: 'Prepared for Plaid API integration with tokenized authentication and end-to-end encryption.',
      color: 'bg-amber-50 text-brand-warning'
    },
  ];

  const benefits = [
    'Gain 100% visibility over monthly cash flow and discretionary outflows',
    'Stop relying on cumbersome, manual spreadsheets that quickly get out of date',
    'Stay ahead of bills with proactive automated near-limit notifications',
    'Designed for smooth transition into full-stack MERN with Node & MongoDB',
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="h-20 border-b border-brand-border bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <IconWallet className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-brand-text tracking-tight flex items-center gap-2">
              FinFlow <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue">SaaS</span>
            </span>
          </div>

          {/* Nav links & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setCurrentPage('login')}
              className="text-sm font-semibold text-slate-600 hover:text-brand-blue px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <Button
              onClick={() => setCurrentPage('register')}
              variant="primary"
              size="sm"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-brand-blue text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span>Modern Personal Finance Management Dashboard</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-text tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Take absolute control of your <span className="text-brand-blue">personal wealth</span> and cash flow.
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Monitor balances, set granular monthly category budgets, track spending analytics, and connect bank accounts in one modern, unified fintech interface.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              onClick={() => setCurrentPage('register')}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md shadow-blue-500/20"
            >
              Create Free Account &rarr;
            </Button>
            <Button
              onClick={() => setCurrentPage('login')}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Explore Live Demo
            </Button>
          </div>

          {/* Dashboard Preview Card Mockup */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-8 border border-brand-border shadow-2xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">https://app.finflow.dev/dashboard</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-brand-success">
                Live Overview
              </span>
            </div>

            {/* Quick Metrics Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-brand-muted uppercase">Total Balance</span>
                <p className="text-lg sm:text-xl font-bold text-brand-text font-mono">₹2,48,750</p>
                <span className="text-[10px] text-brand-success font-semibold">+12.4% vs last mo</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-brand-muted uppercase">Monthly Income</span>
                <p className="text-lg sm:text-xl font-bold text-brand-success font-mono">₹1,45,000</p>
                <span className="text-[10px] text-brand-success font-semibold">+8.1% vs last mo</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-brand-muted uppercase">Total Expenses</span>
                <p className="text-lg sm:text-xl font-bold text-brand-danger font-mono">₹82,650</p>
                <span className="text-[10px] text-brand-success font-semibold">-3.5% vs last mo</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-brand-muted uppercase">Net Savings</span>
                <p className="text-lg sm:text-xl font-bold text-brand-blue font-mono">₹62,350</p>
                <span className="text-[10px] text-brand-blue font-semibold">+22.8% rate</span>
              </div>
            </div>

            {/* Simulated mini charts & budget bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <h5 className="text-xs font-bold text-brand-text mb-2">Category Budget Adherence</h5>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Food & Dining</span>
                      <span className="font-semibold text-amber-600">₹4,200 / ₹5,000 (84%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-[84%] h-full bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>Shopping</span>
                      <span className="font-semibold text-teal-600">₹2,000 / ₹3,500 (57%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-[57%] h-full bg-brand-teal rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-brand-text mb-1">Plaid Multi-Bank Sync</h5>
                  <p className="text-[11px] text-brand-muted">HDFC, ICICI, SBI & Credit Cards synchronized</p>
                  <span className="inline-block mt-3 text-xs text-brand-blue font-semibold">
                    100% Ready for MongoDB & Express &rarr;
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-lg">
                  ₹
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-16 bg-white border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">
                Engineered for Complete Financial Clarity
              </h2>
              <p className="text-sm text-brand-muted mt-2">
                Everything you need to manage your personal finances with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-brand-bg border border-brand-border shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-brand-text mb-2">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                  Why FinFlow?
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4 leading-tight">
                  Stop stressing about where your monthly paycheck went.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  FinFlow offers proactive intelligence rather than just passive history. Know when you are approaching limits before you overspend.
                </p>

                <div className="space-y-3">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-200">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-4">
                <h3 className="text-lg font-bold text-white">Ready to start tracking?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join students, freelancers, and professionals who manage their money effortlessly with our modern fintech dashboard.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => setCurrentPage('register')}
                    variant="teal"
                    size="lg"
                    className="w-full"
                  >
                    Open Your Free Dashboard Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-blue flex items-center justify-center text-white">
              <IconWallet className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-brand-text">FinFlow PFM Dashboard</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPage('login')} className="hover:text-brand-blue">Login</button>
            <button onClick={() => setCurrentPage('register')} className="hover:text-brand-blue">Register</button>
            <span>Built for MERN Stack Internship Month 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
