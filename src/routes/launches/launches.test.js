const supertest = require("supertest");
const app = require("../../app");

const server = supertest(app);

describe("Test GET /launches", () => {
  test("It should respond with 200 success code", async () => {
    await server.get("/launches").expect("Content-Type", /json/).expect(200);
  });
});

describe("Test POST /launches", () => {
  const payload = {
    mission: "USS Enterprise",
    rocket: "NHO !!QQ",
    target: "Kepler 123;",
    launchDate: "March 21, 2022",
  };

  const payloadWithoutDate = {
    mission: "USS Enterprise",
    rocket: "NHO !!QQ",
    target: "Kepler 123;",
  };

  test("It should respond with 201 created code", async () => {
    const response = await server
      .post("/launches")
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
      .post("/launches")
      .send(payloadWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("It should catch invalid date", async () => {
    const response = await server
      .post("/launches")
      .send({ ...payload, launchDate: "Saturday" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid date property",
    });
  });
});
