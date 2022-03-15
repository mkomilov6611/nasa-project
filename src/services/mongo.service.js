const mongoose = require("mongoose");

// FIXME: when using Mongo`s Atlas Cluster
// const MONGO_USERNAME = "mkomilov6611";
// const MONGO_PASSWORD = "L8kHcCglUEry1VPC";
// const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@nasamongocluster.kkt18.mongodb.net/nasa-database?retryWrites=true&w=majority`;
const MONGO_URL = `mongodb://localhost:27017/nasa-database`;

mongoose.connection.once("open", () => {
  console.info("Connected to MongoDB!!");
});

mongoose.connection.on("error", (error) => {
  console.error({ error });
});

async function connectMongo() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
