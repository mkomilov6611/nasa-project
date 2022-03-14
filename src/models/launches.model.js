const launches = require("./launches.mongo");

let latestFlightNumber = 100;

async function getAllLaunches() {
  return launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function addNewLaunch(launch) {
  latestFlightNumber++;

  await saveLaunch(
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

function hasLaunch(flightNumber) {
  return !!launches.has(flightNumber);
}

function deleteLaunch(flightNumber) {
  const deletedLaunch = launches.get(flightNumber);

  deletedLaunch.upcoming = false;
  deletedLaunch.success = false;

  return deletedLaunch;
}

module.exports = { getAllLaunches, addNewLaunch, hasLaunch, deleteLaunch };
