const request = require("supertest");
const app = require("../src/server");

describe("Health endpoints", () => {
  it("returns OK for /health", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      status: "healthy",
    });
  });

  it("returns running status for root endpoint", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Server is Running");
  });
});

