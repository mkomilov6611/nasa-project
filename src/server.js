const { createServer } = require("http");

const { connectMongo } = require("./services/mongo.service");
const { loadPlanetsData } = require("./models/planets.model");

const app = require("./app");
const server = createServer(app);

const PORT = process.env.PORT || 6611;

async function startServer() {
  try {
    await connectMongo();
    await loadPlanetsData();

    server.listen(PORT, () => {
      console.log("Listening on port " + PORT + "...");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
