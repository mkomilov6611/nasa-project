const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_CLUSTER_URL;

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
