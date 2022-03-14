const {
  hasLaunch,
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
} = require("../../models/launches.model.js");

async function httpGetAllLaunches(req, res) {
  try {
    return res.status(200).json(await getAllLaunches());
  } catch (error) {
    res.status(500).json({
      error: "Could not retrieve data",
    });
  }
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  // Needs Validation
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid date property",
    });
  }

  await addNewLaunch(launch);

  return res
    .status(201)
    .json({ message: "Launch is successfully added", launch });
}

function httpDeleteLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);

  if (!hasLaunch(flightNumber)) {
    return res.status(404).json({
      message: "Missing flight number",
    });
  }

  return res.status(200).json(deleteLaunch(flightNumber));
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
};
