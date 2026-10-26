# PFM Dashboard — Backend

Node.js/Express/MongoDB backend for the Personal Finance Management Dashboard.
Covers auth, Plaid integration, transactions, and budgeting.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, and Plaid sandbox keys
npm run dev            # requires nodemon; or `npm start`
```

Get free Plaid sandbox keys at https://dashboard.plaid.com/signup — sandbox
mode uses fake banks/data, no real bank account needed.

## Tests

```bash
npm test
```

Runs against an in-memory MongoDB (`mongodb-memory-server`) — no real
database needed to run the suite. Covers auth, transactions, and budgets.

## Endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a user |
| POST | `/api/auth/login` | Get a JWT |
| GET | `/api/auth/me` | Verify a token, get current user |
| POST | `/api/plaid/create-link-token` | Get a token for Plaid Link on the frontend |
| POST | `/api/plaid/exchange-public-token` | Exchange Plaid Link's public_token, save accounts |
| GET | `/api/plaid/accounts` | List linked accounts |
| POST | `/api/plaid/sync-transactions` | Pull last 30 days of transactions from Plaid |
| GET | `/api/transactions` | List stored transactions |
| POST | `/api/transactions` | Manually add a transaction |
| PUT | `/api/transactions/:id` | Edit a transaction |
| GET | `/api/transactions/summary/by-category` | Totals per category — feeds the Recharts pie chart |
| GET | `/api/budgets` | List category limits |
| PUT | `/api/budgets` | Set or update a category's monthly limit |
| GET | `/api/budgets/status` | Each budget with this month's actual spend and over/under status |

All routes except `/api/auth/register` and `/api/auth/login` require:
`Authorization: Bearer <token>`

## Team ownership

- **Backend, auth, Plaid, security** — team lead
- **Budgeting feature + test suite** — 4th member (`routes/budgets.js`, `__tests__/`)

See the frontend README for the Mridul/Avadhut split.
