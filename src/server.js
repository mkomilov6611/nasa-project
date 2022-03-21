const { createServer } = require("http");

require("dotenv").config();

const app = require("./app");
const { connectMongo } = require("./services/mongo.service");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const server = createServer(app);
const PORT = process.env.PORT || 6611;

async function startServer() {
  try {
    await connectMongo();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
      console.log("Listening on port " + PORT + "...");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
