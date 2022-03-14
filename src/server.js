const { createServer } = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const server = createServer(app);

const MONGO_USERNAME = "mkomilov6611";
const MONGO_PASSWORD = "L8kHcCglUEry1VPC";
// const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@nasamongocluster.kkt18.mongodb.net/nasa-database?retryWrites=true&w=majority`;
const MONGO_URL = `mongodb://localhost:27017/nasa-database`;

const PORT = process.env.PORT || 6611;

mongoose.connection.once("open", () => {
  console.info("Connected to MongoDB!!");
});

mongoose.connection.on("error", (error) => {
  console.error({ error });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error.reason);
  }

  server.listen(PORT, () => {
    console.log("Listening on port " + PORT + "...");
  });
}

startServer();
