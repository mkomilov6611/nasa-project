const HttpsProxyAgent = require("https-proxy-agent");
const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const httpsAgent = new HttpsProxyAgent({
  host: "10.9.0.29",
  port: 42897,
});

const spaceXClient = axios.create({
  httpsAgent,
  baseURL: "https://api.spacexdata.com/v4",
  timeout: 30000,
});

async function loadLaunchesData() {
  const sampleLeftLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  const sampleRightLaunch = await findLaunch({
    flightNumber: 155,
    rocket: "Falcon 9",
    mission: "Ax-1",
  });

  if (sampleLeftLaunch && sampleRightLaunch) {
    console.log("LAUNCH DATA already loaded");
    return;
  }

  await populateLaunches();
}

async function populateLaunches() {
  const response = await spaceXClient.post("/launches/query", {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status != 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  const launches = [];

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);

    launches.push({
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    });
  }

  await Promise.all(
    launches.map(async (launch) => {
      return saveLaunch(launch);
    })
  );
}

async function findLaunch(filter) {
  return launches.findOne(filter);
}

async function getAllLaunches({ skip, limit }) {
  return launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function getLatestFlightNumber() {
  const DEFAULT_FLIGHT_NUMBER = 100;
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

function hasLaunch(flightNumber) {
  return launches.findOne({ flightNumber });
}

async function deleteLaunch(flightNumber) {
  const deleted = await launches.updateOne(
    {
      flightNumber,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return deleted.acknowledged && deleted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  hasLaunch,
  deleteLaunch,
};
