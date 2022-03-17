const mongoose = require("mongoose");

// FIXME: when using Mongo`s Atlas Cluster
// const MONGO_USERNAME = "mkomilov6611";
// const MONGO_PASSWORD = "L8kHcCglUEry1VPC";
// const MONGO_URL = process.env.MONGO_CLUSTER_URL;
const MONGO_URL = process.env.MONGO_LOCAL_URL;

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
