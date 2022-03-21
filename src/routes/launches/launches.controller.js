const {
  hasLaunch,
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunch,
} = require("../../models/launches.model.js");

const { getPagination } = require("../../services/query.service");

async function httpGetAllLaunches(req, res) {
  try {
    const options = getPagination(req.query);
    const launches = await getAllLaunches(options);

    return res.status(200).json(launches);
  } catch (error) {
    res.status(500).json({
      error: "Could not retrieve data",
    });
  }
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

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

  try {
    await scheduleNewLaunch(launch);

    return res
      .status(201)
      .json({ message: "Launch is successfully added", launch });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function httpDeleteLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);
  const existsLaunch = await hasLaunch(flightNumber);

  if (!existsLaunch) {
    return res.status(404).json({
      error: "No such flight number exist",
    });
  }

  const deletedLaunch = await deleteLaunch(flightNumber);

  if (!deletedLaunch) {
    return res.status(400).json({
      error: "Launch not deleted",
    });
  }

  return res.status(200).json({
    message: "Launch is deleted",
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
};
