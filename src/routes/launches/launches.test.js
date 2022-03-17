const supertest = require("supertest");

const {
  connectMongo,
  disconnectMongo,
} = require("../../services/mongo.service");

const app = require("../../app");
const server = supertest(app);

describe("Launches API", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success code", async () => {
      await server
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const payload = {
      mission: "USS Enterprise",
      rocket: "NHO !!QQ",
      target: "Kepler-442 b",
      launchDate: "March 21, 2022",
    };

    const payloadWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NHO !!QQ",
      target: "Kepler-442 b",
    };

    test("It should respond with 201 created code", async () => {
      const response = await server
        .post("/v1/launches")
        .send(payload)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestLaunchDate = new Date(payload.launchDate).valueOf();
      const responseLaunchDate = new Date(
        response.body.launch.launchDate
      ).valueOf();

      expect(responseLaunchDate).toBe(requestLaunchDate);
      expect(response.body.launch).toMatchObject(payloadWithoutDate);
    });

    test("It should catch missing required props", async () => {
      const response = await server
        .post("/v1/launches")
        .send(payloadWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid date", async () => {
      const response = await server
        .post("/v1/launches")
        .send({ ...payload, launchDate: "Saturday" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid date property",
      });
    });
  });

  describe("Test DELETE /launches/:flightNumber", () => {
    const invalidFlightNumber = -11;
    const deletedFlightNumber = 101;
    const flightNumber = 110; // Should be switched to other after deletion

    test("It should respond with 404 error code", async () => {
      await server
        .delete("/v1/launches/" + invalidFlightNumber)
        .expect("Content-Type", /json/)
        .expect(404);
    });

    test("It should respond with 400 error code", async () => {
      await server
        .delete("/v1/launches/" + deletedFlightNumber)
        .expect("Content-Type", /json/)
        .expect(400);
    });

    test("It should respond with 200 success code", async () => {
      await server
        .delete("/v1/launches/" + flightNumber)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
