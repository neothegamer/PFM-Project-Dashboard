const request = require("supertest");
require("./setup");
const createApp = require("../app");
const Account = require("../models/Account");

const app = createApp();

async function registerAndLogin() {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test", email: "tx@example.com", password: "password123" });
  return { token: res.body.token, userId: res.body.user.id };
}

describe("Transactions", () => {
  test("blocks all transaction routes without a token", async () => {
    const res = await request(app).get("/api/transactions");
    expect(res.status).toBe(401);
  });

  test("manually adds and then lists a transaction", async () => {
    const { token, userId } = await registerAndLogin();
    const account = await Account.create({
      user: userId,
      plaidAccountId: "test-account-1",
      itemId: "test-item-1",
      name: "Checking",
    });

    const add = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ account: account._id, name: "Coffee", amount: 4.5, date: "2026-08-01", category: "Dining" });
    expect(add.status).toBe(201);
    expect(add.body.transaction.isManual).toBe(true);

    const list = await request(app).get("/api/transactions").set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.transactions).toHaveLength(1);
    expect(list.body.transactions[0].name).toBe("Coffee");
  });

  test("rejects adding a transaction with missing fields", async () => {
    const { token } = await registerAndLogin();
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Missing account and amount" });
    expect(res.status).toBe(400);
  });

  test("edits an existing transaction", async () => {
    const { token, userId } = await registerAndLogin();
    const account = await Account.create({
      user: userId,
      plaidAccountId: "test-account-2",
      itemId: "test-item-2",
      name: "Checking",
    });
    const add = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ account: account._id, name: "Groceries", amount: 60, date: "2026-08-02" });

    const edit = await request(app)
      .put(`/api/transactions/${add.body.transaction._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Food" });
    expect(edit.status).toBe(200);
    expect(edit.body.transaction.category).toBe("Food");
  });

  test("summarizes totals by category", async () => {
    const { token, userId } = await registerAndLogin();
    const account = await Account.create({
      user: userId,
      plaidAccountId: "test-account-3",
      itemId: "test-item-3",
      name: "Checking",
    });
    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ account: account._id, name: "Groceries", amount: 50, date: "2026-08-01", category: "Food" });
    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ account: account._id, name: "Snacks", amount: 10, date: "2026-08-02", category: "Food" });

    const summary = await request(app)
      .get("/api/transactions/summary/by-category")
      .set("Authorization", `Bearer ${token}`);
    expect(summary.status).toBe(200);
    expect(summary.body.summary[0]).toMatchObject({ _id: "Food", total: 60 });
  });
});
