import React from 'react';

/*
  Central icon system for PFM Dashboard.
  Uses inline SVG only.
  Supports both:

  <Icon name="wallet" />

  and

  <IconWallet />
*/

const svg = (children, size = 20, className = '', strokeWidth = 2) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const Icon = ({
  name,
  size = 20,
  className = '',
  strokeWidth = 2,
}) => {
  const icons = {

    /* =========================
       DASHBOARD / NAVIGATION
    ========================= */

    dashboard: svg(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>,
      size,
      className,
      strokeWidth
    ),

    transactions: svg(
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h7" />
        <path d="M7 16h5" />
      </>,
      size,
      className,
      strokeWidth
    ),

    accounts: svg(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h5" />
      </>,
      size,
      className,
      strokeWidth
    ),

    budget: svg(
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19H2" />
      </>,
      size,
      className,
      strokeWidth
    ),

    analytics: svg(
      <>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="m7 15 4-4 3 2 6-7" />
        <path d="M17 6h3v3" />
      </>,
      size,
      className,
      strokeWidth
    ),

    settings: svg(
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.6 1Z" />
      </>,
      size,
      className,
      strokeWidth
    ),

    logout: svg(
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    logOut: svg(
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    menu: svg(
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>,
      size,
      className,
      strokeWidth
    ),

    x: svg(
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       SEARCH / HEADER
    ========================= */

    search: svg(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>,
      size,
      className,
      strokeWidth
    ),

    bell: svg(
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       ACTIONS
    ========================= */

    plus: svg(
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>,
      size,
      className,
      strokeWidth
    ),

    edit: svg(
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>,
      size,
      className,
      strokeWidth
    ),

    trash: svg(
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>,
      size,
      className,
      strokeWidth
    ),

    check: svg(
      <>
        <path d="m5 12 4 4L19 6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    arrowUp: svg(
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    arrowDown: svg(
      <>
        <path d="M12 5v14" />
        <path d="m18 13-6 6-6-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    arrowRight: svg(
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    arrowUpRight: svg(
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>,
      size,
      className,
      strokeWidth
    ),

    arrowDownLeft: svg(
      <>
        <path d="M17 7 7 17" />
        <path d="M17 17H7V7" />
      </>,
      size,
      className,
      strokeWidth
    ),

    chevronDown: svg(
      <>
        <path d="m6 9 6 6 6-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    chevronLeft: svg(
      <>
        <path d="m15 18-6-6 6-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    chevronRight: svg(
      <>
        <path d="m9 18 6-6-6-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    filter: svg(
      <>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       VISIBILITY
    ========================= */

    eye: svg(
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>,
      size,
      className,
      strokeWidth
    ),

    eyeOff: svg(
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7s-3.5 7-10 7a9.9 9.9 0 0 1-4.1-.9" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       FINANCE
    ========================= */

    wallet: svg(
      <>
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M4 8h16" />
        <path d="M16 13h4" />
        <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
      </>,
      size,
      className,
      strokeWidth
    ),

    piggyBank: svg(
      <>
        <path d="M5 11a7 7 0 0 1 12.5-4.3L20 8v5a3 3 0 0 1-3 3h-1l-1 3h-2l.5-3h-4L8 19H6l1-3a6 6 0 0 1-2-5Z" />
        <path d="M17 8h2" />
        <circle cx="9" cy="10" r="1" />
        <path d="M4 13H2v-3h3" />
      </>,
      size,
      className,
      strokeWidth
    ),

    target: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>,
      size,
      className,
      strokeWidth
    ),

    category: svg(
      <>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
      </>,
      size,
      className,
      strokeWidth
    ),

    creditCard: svg(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </>,
      size,
      className,
      strokeWidth
    ),

    building: svg(
      <>
        <path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17" />
        <path d="M2 21h20" />
        <path d="M8 7h2" />
        <path d="M14 7h2" />
        <path d="M8 11h2" />
        <path d="M14 11h2" />
        <path d="M10 21v-5h4v5" />
      </>,
      size,
      className,
      strokeWidth
    ),

    trendingUp: svg(
      <>
        <path d="m3 17 6-6 4 4 7-8" />
        <path d="M14 7h6v6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    trendingDown: svg(
      <>
        <path d="m3 7 6 6 4-4 7 8" />
        <path d="M14 17h6v-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       USER / SECURITY
    ========================= */

    user: svg(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>,
      size,
      className,
      strokeWidth
    ),

    shield: svg(
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>,
      size,
      className,
      strokeWidth
    ),

    lock: svg(
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>,
      size,
      className,
      strokeWidth
    ),

    link: svg(
      <>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 7 20l1.1-1.1" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       ALERTS
    ========================= */

    alertTriangle: svg(
      <>
        <path d="m12 3 10 18H2Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>,
      size,
      className,
      strokeWidth
    ),

    alertCircle: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </>,
      size,
      className,
      strokeWidth
    ),

    info: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>,
      size,
      className,
      strokeWidth
    ),

    /* =========================
       OTHER
    ========================= */

    refresh: svg(
      <>
        <path d="M20 11a8 8 0 0 0-14.9-3L3 11" />
        <path d="M3 5v6h6" />
        <path d="M4 13a8 8 0 0 0 14.9 3L21 13" />
        <path d="M21 19v-6h-6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    list: svg(
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>,
      size,
      className,
      strokeWidth
    ),

    barChart: svg(
      <>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="M8 16v-5" />
        <path d="M13 16V8" />
        <path d="M18 16V6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    pieChart: svg(
      <>
        <path d="M12 2v10h10" />
        <path d="M20.5 15A9 9 0 1 1 9 3.5" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </>,
      size,
      className,
      strokeWidth
    ),

    sortAsc: svg(
      <>
        <path d="M8 17V7" />
        <path d="m5 10 3-3 3 3" />
        <path d="M14 7h6" />
        <path d="M14 12h6" />
        <path d="M14 17h6" />
      </>,
      size,
      className,
      strokeWidth
    ),

    calendar: svg(
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M3 10h18" />
      </>,
      size,
      className,
      strokeWidth
    ),

    download: svg(
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>,
      size,
      className,
      strokeWidth
    ),
  };

  return icons[name] || null;
};

/* =========================================================
   NAMED EXPORTS
========================================================= */

export const IconDashboard = (props) => (
  <Icon name="dashboard" {...props} />
);

export const IconTransactions = (props) => (
  <Icon name="transactions" {...props} />
);

export const IconAccounts = (props) => (
  <Icon name="accounts" {...props} />
);

export const IconBudget = (props) => (
  <Icon name="budget" {...props} />
);

export const IconAnalytics = (props) => (
  <Icon name="analytics" {...props} />
);

export const IconSettings = (props) => (
  <Icon name="settings" {...props} />
);

export const IconLogout = (props) => (
  <Icon name="logout" {...props} />
);

export const IconLogOut = (props) => (
  <Icon name="logOut" {...props} />
);

export const IconMenu = (props) => (
  <Icon name="menu" {...props} />
);

export const IconX = (props) => (
  <Icon name="x" {...props} />
);

export const IconSearch = (props) => (
  <Icon name="search" {...props} />
);

export const IconBell = (props) => (
  <Icon name="bell" {...props} />
);

export const IconPlus = (props) => (
  <Icon name="plus" {...props} />
);

export const IconEdit = (props) => (
  <Icon name="edit" {...props} />
);

export const IconTrash = (props) => (
  <Icon name="trash" {...props} />
);

export const IconCheck = (props) => (
  <Icon name="check" {...props} />
);

export const IconArrowUp = (props) => (
  <Icon name="arrowUp" {...props} />
);

export const IconArrowDown = (props) => (
  <Icon name="arrowDown" {...props} />
);

export const IconArrowRight = (props) => (
  <Icon name="arrowRight" {...props} />
);

export const IconArrowUpRight = (props) => (
  <Icon name="arrowUpRight" {...props} />
);

export const IconArrowDownLeft = (props) => (
  <Icon name="arrowDownLeft" {...props} />
);

export const IconChevronDown = (props) => (
  <Icon name="chevronDown" {...props} />
);

export const IconChevronLeft = (props) => (
  <Icon name="chevronLeft" {...props} />
);

export const IconChevronRight = (props) => (
  <Icon name="chevronRight" {...props} />
);

export const IconFilter = (props) => (
  <Icon name="filter" {...props} />
);

export const IconEye = (props) => (
  <Icon name="eye" {...props} />
);

export const IconEyeOff = (props) => (
  <Icon name="eyeOff" {...props} />
);

export const IconWallet = (props) => (
  <Icon name="wallet" {...props} />
);

export const IconPiggyBank = (props) => (
  <Icon name="piggyBank" {...props} />
);

export const IconTarget = (props) => (
  <Icon name="target" {...props} />
);

export const IconCategory = (props) => (
  <Icon name="category" {...props} />
);

export const IconCreditCard = (props) => (
  <Icon name="creditCard" {...props} />
);

export const IconBuilding = (props) => (
  <Icon name="building" {...props} />
);

export const IconTrendingUp = (props) => (
  <Icon name="trendingUp" {...props} />
);

export const IconTrendingDown = (props) => (
  <Icon name="trendingDown" {...props} />
);

export const IconUser = (props) => (
  <Icon name="user" {...props} />
);

export const IconShield = (props) => (
  <Icon name="shield" {...props} />
);

export const IconLock = (props) => (
  <Icon name="lock" {...props} />
);

export const IconLink = (props) => (
  <Icon name="link" {...props} />
);

export const IconAlertTriangle = (props) => (
  <Icon name="alertTriangle" {...props} />
);

export const IconAlertCircle = (props) => (
  <Icon name="alertCircle" {...props} />
);

export const IconInfo = (props) => (
  <Icon name="info" {...props} />
);

export const IconRefresh = (props) => (
  <Icon name="refresh" {...props} />
);

export const IconList = (props) => (
  <Icon name="list" {...props} />
);

export const IconBarChart = (props) => (
  <Icon name="barChart" {...props} />
);

export const IconPieChart = (props) => (
  <Icon name="pieChart" {...props} />
);

export const IconSortAsc = (props) => (
  <Icon name="sortAsc" {...props} />
);

export const IconCalendar = (props) => (
  <Icon name="calendar" {...props} />
);

export const IconDownload = (props) => (
  <Icon name="download" {...props} />
);

export default Icon;