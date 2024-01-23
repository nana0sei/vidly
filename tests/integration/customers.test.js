const request = require("supertest");
let server;
const { Customer } = require("../../models/customer");
const { User } = require("../../models/user");
const { before } = require("lodash");

describe("/api/customers", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Customer.deleteMany({});
  });

  //tests
  describe("GET /", () => {
    it("should return all customers", async () => {
      await Customer.collection.insertMany([
        { name: "customer1", isGold: true, phone: "12345" },
        { name: "customer2", isGold: false, phone: "67890" },
      ]);

      const res = await request(server).get("/api/customers");
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === "customer1")).toBeTruthy();
      expect(res.body.some((c) => c.name === "customer2")).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let token;
    let name;
    let isGold;
    let phone;

    const exec = () => {
      return request(server)
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name, isGold, phone });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "customer1";
      isGold = true;
      phone = "12345";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if customer name is invalid", async () => {
      name = "a";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if phone number is invalid", async () => {
      phone = "1";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if isGold is not set", async () => {
      isGold = "";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the customer if input is valid", async () => {
      await exec();

      const customer = await Customer.find({ name: "customer1" });
      expect(customer).not.toBeNull();
    });

    it("should return the saved customer", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining(["name", "isGold", "phone"])
      );
    });
  });
});
