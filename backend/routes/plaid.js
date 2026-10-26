const express = require("express");
const plaidClient = require("../config/plaid");
const requireAuth = require("../middleware/auth");
const User = require("../models/User");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const router = express.Router();

// POST /api/plaid/create-link-token
// Frontend calls this first, uses the returned link_token to open Plaid Link
router.post("/create-link-token", requireAuth, async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.userId.toString() },
      client_name: "PFM Dashboard",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create link token" });
  }
});

// POST /api/plaid/exchange-public-token
// Frontend sends the public_token it got back from Plaid Link after the user connects a bank
router.post("/exchange-public-token", requireAuth, async (req, res) => {
  try {
    const { public_token } = req.body;
    if (!public_token) return res.status(400).json({ error: "public_token is required" });

    // Exchange for a permanent access_token — this is the only place this happens,
    // and access_token is never sent back to the frontend from here or anywhere else
    const exchange = await plaidClient.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = exchange.data;

    const institution = await plaidClient.itemGet({ access_token });
    const institutionName = institution.data.item.institution_id || "Connected Bank";

    await User.findByIdAndUpdate(req.userId, {
      $push: { plaidItems: { accessToken: access_token, itemId: item_id, institutionName } },
    });

    // Pull accounts immediately so the frontend has something to show right away
    const accountsResponse = await plaidClient.accountsGet({ access_token });
    const savedAccounts = await Promise.all(
      accountsResponse.data.accounts.map((acc) =>
        Account.findOneAndUpdate(
          { plaidAccountId: acc.account_id },
          {
            user: req.userId,
            plaidAccountId: acc.account_id,
            itemId: item_id,
            name: acc.name,
            officialName: acc.official_name,
            type: acc.type,
            subtype: acc.subtype,
            mask: acc.mask,
            currentBalance: acc.balances.current,
            availableBalance: acc.balances.available,
            isoCurrencyCode: acc.balances.iso_currency_code || "USD",
          },
          { upsert: true, new: true }
        )
      )
    );

    res.json({ message: "Bank account connected", accounts: savedAccounts });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to exchange public token" });
  }
});

// GET /api/plaid/accounts — accounts already saved in Mongo for this user
router.get("/accounts", requireAuth, async (req, res) => {
  const accounts = await Account.find({ user: req.userId });
  res.json({ accounts });
});

// POST /api/plaid/sync-transactions — fetch recent transactions from Plaid and store them
router.post("/sync-transactions", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.plaidItems.length) {
      return res.status(400).json({ error: "No linked bank accounts" });
    }

    let totalSynced = 0;
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);

    for (const item of user.plaidItems) {
      const response = await plaidClient.transactionsGet({
        access_token: item.accessToken,
        start_date: startDate,
        end_date: endDate,
      });

      for (const txn of response.data.transactions) {
        const account = await Account.findOne({ plaidAccountId: txn.account_id });
        if (!account) continue;

        await Transaction.findOneAndUpdate(
          { plaidTransactionId: txn.transaction_id },
          {
            user: req.userId,
            account: account._id,
            plaidTransactionId: txn.transaction_id,
            name: txn.name,
            amount: txn.amount,
            date: new Date(txn.date),
            category: txn.category?.[0] || "Uncategorized",
          },
          { upsert: true }
        );
        totalSynced++;
      }
    }

    res.json({ message: `Synced ${totalSynced} transactions` });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to sync transactions" });
  }
});

module.exports = router;
