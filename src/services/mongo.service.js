const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
  console.info("Connected to MongoDB!!");
});

mongoose.connection.on("error", (error) => {
  console.error({ error });
});

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_CLUSTER_URL, {
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
