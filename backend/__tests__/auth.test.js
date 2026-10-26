const request = require("supertest");
require("./setup");
const createApp = require("../app");

const app = createApp();

describe("Auth", () => {
  const credentials = { name: "Test User", email: "test@example.com", password: "password123" };

  test("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send(credentials);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(credentials.email);
  });

  test("rejects registering the same email twice", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app).post("/api/auth/register").send(credentials);
    expect(res.status).toBe(409);
  });

  test("rejects registration with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "x@x.com" });
    expect(res.status).toBe(400);
  });

  test("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: credentials.email, password: credentials.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: credentials.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  test("blocks /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  test("allows /me with a valid token", async () => {
    const register = await request(app).post("/api/auth/register").send(credentials);
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${register.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(credentials.email);
    expect(res.body.user.password).toBeUndefined(); // never leak the hash
  });
});
