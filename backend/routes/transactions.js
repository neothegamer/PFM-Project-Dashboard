const express = require("express");
const requireAuth = require("../middleware/auth");
const Transaction = require("../models/Transaction");

const router = express.Router();

// GET /api/transactions — plain list, this is your "bare-bones frontend" data source (step 3)
router.get("/", requireAuth, async (req, res) => {
  const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 }).limit(200);
  res.json({ transactions });
});

// POST /api/transactions — manually add one (Week 4 feature, but useful for testing without Plaid)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { account, name, amount, date, category } = req.body;
    if (!account || !name || amount === undefined || !date) {
      return res.status(400).json({ error: "account, name, amount, and date are required" });
    }
    const txn = await Transaction.create({
      user: req.userId,
      account,
      name,
      amount,
      date,
      category: category || "Uncategorized",
      isManual: true,
    });
    res.status(201).json({ transaction: txn });
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// PUT /api/transactions/:id — edit a transaction (name, amount, category)
router.put("/:id", requireAuth, async (req, res) => {
  const txn = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!txn) return res.status(404).json({ error: "Transaction not found" });
  res.json({ transaction: txn });
});

// GET /api/transactions/summary — powers the pie/bar charts (step 5)
router.get("/summary/by-category", requireAuth, async (req, res) => {
  const summary = await Transaction.aggregate([
    { $match: { user: req.userId } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);
  res.json({ summary });
});

module.exports = router;
