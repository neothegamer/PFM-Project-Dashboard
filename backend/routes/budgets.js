const express = require("express");
const requireAuth = require("../middleware/auth");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const router = express.Router();

// GET /api/budgets — list this user's category limits
router.get("/", requireAuth, async (req, res) => {
  const budgets = await Budget.find({ user: req.userId });
  res.json({ budgets });
});

// PUT /api/budgets — create or update a category's monthly limit
router.put("/", requireAuth, async (req, res) => {
  const { category, monthlyLimit } = req.body;
  if (!category || monthlyLimit === undefined) {
    return res.status(400).json({ error: "category and monthlyLimit are required" });
  }
  const budget = await Budget.findOneAndUpdate(
    { user: req.userId, category },
    { monthlyLimit },
    { upsert: true, new: true }
  );
  res.json({ budget });
});

// GET /api/budgets/status — each budget alongside this month's actual spend
router.get("/status", requireAuth, async (req, res) => {
  const budgets = await Budget.find({ user: req.userId });
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const status = await Promise.all(
    budgets.map(async (b) => {
      const spent = await Transaction.aggregate([
        { $match: { user: req.userId, category: b.category, date: { $gte: startOfMonth }, amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const spentTotal = spent[0]?.total || 0;
      return {
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent: spentTotal,
        remaining: b.monthlyLimit - spentTotal,
        overBudget: spentTotal > b.monthlyLimit,
      };
    })
  );

  res.json({ status });
});

module.exports = router;
