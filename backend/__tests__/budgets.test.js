const request = require("supertest");
require("./setup");
const createApp = require("../app");
const Account = require("../models/Account");

const app = createApp();

async function registerAndLogin() {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test", email: "budget@example.com", password: "password123" });
  return { token: res.body.token, userId: res.body.user.id };
}

describe("Budgets", () => {
  test("sets and retrieves a category limit", async () => {
    const { token } = await registerAndLogin();
    const put = await request(app)
      .put("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Dining", monthlyLimit: 200 });
    expect(put.status).toBe(200);
    expect(put.body.budget.monthlyLimit).toBe(200);

    const list = await request(app).get("/api/budgets").set("Authorization", `Bearer ${token}`);
    expect(list.body.budgets).toHaveLength(1);
  });

  test("updates an existing category limit instead of duplicating it", async () => {
    const { token } = await registerAndLogin();
    await request(app)
      .put("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Dining", monthlyLimit: 200 });
    await request(app)
      .put("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Dining", monthlyLimit: 250 });

    const list = await request(app).get("/api/budgets").set("Authorization", `Bearer ${token}`);
    expect(list.body.budgets).toHaveLength(1);
    expect(list.body.budgets[0].monthlyLimit).toBe(250);
  });

  test("flags a category as over budget once spend exceeds the limit", async () => {
    const { token, userId } = await registerAndLogin();
    const account = await Account.create({
      user: userId,
      plaidAccountId: "budget-account-1",
      itemId: "budget-item-1",
      name: "Checking",
    });
    await request(app)
      .put("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Dining", monthlyLimit: 30 });

    const today = new Date().toISOString().slice(0, 10);
    await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ account: account._id, name: "Dinner out", amount: 45, date: today, category: "Dining" });

    const status = await request(app).get("/api/budgets/status").set("Authorization", `Bearer ${token}`);
    expect(status.status).toBe(200);
    expect(status.body.status[0].overBudget).toBe(true);
    expect(status.body.status[0].remaining).toBe(-15);
  });
});
