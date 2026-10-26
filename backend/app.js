const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const plaidRoutes = require("./routes/plaid");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budgets");

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/plaid", plaidRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/budgets", budgetRoutes);

  return app;
}

module.exports = createApp;
