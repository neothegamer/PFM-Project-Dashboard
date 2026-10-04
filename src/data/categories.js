// src/data/categories.js
// Single source of truth for category names across the app.
// Names align with the backend categorizer + Plaid-style categories (see BudgetPage).

export const CATEGORIES = [
  'Food and Drink',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Housing',
  'Utilities',
  'Health',
  'Travel',
  'Transfer',
  'Payment',
  'Recreation',
  'Shops',
  'Income',
  'Other',
];

export const CATEGORY_ICONS = {
  'Food and Drink': '🍔',   // 🍔
  'Transportation': '🚗',   // 🚗
  'Shopping': '🛍️',   // 🛍️
  'Entertainment': '🎬',    // 🎬
  'Housing': '🏠',          // 🏠
  'Utilities': '⚡',            // ⚡
  'Health': '💊',           // 💊
  'Travel': '✈️',         // ✈️
  'Transfer': '🔄',         // 🔄
  'Payment': '💳',          // 💳
  'Recreation': '🎮',       // 🎮
  'Shops': '🏬',            // 🏬
  'Income': '💰',           // 💰
  'Other': '📦',            // 📦
};

// Safe default for forms that pre-select a category
export const DEFAULT_CATEGORY = 'Food and Drink';

// Generic fallback icon for transactions with an unrecognised/legacy category
export const FALLBACK_ICON = '💳'; // 💳

// One-time data cleanup: old category names -> new names
export const CATEGORY_MIGRATION_MAP = {
  Food: 'Food and Drink',
  Transport: 'Transportation',
  Bills: 'Utilities',
  Healthcare: 'Health',
  Salary: 'Income',
  Freelance: 'Income',
  Investment: 'Income',
};