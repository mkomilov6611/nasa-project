const launches = new Map();

let latestFlightNumber = 100;

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;

  launches.set(
    latestFlightNumber,
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
