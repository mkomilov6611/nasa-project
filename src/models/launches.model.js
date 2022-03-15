const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

async function getAllLaunches() {
  return launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
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
  getAllLaunches,
  scheduleNewLaunch,
  hasLaunch,
  deleteLaunch,
};
