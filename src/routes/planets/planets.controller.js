const { getAllPlanets } = require("../../models/planets.model.js");

async function httpGetAllPlanets(req, res) {
  try {
    return res.status(200).json(await getAllPlanets());
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve data",
    });
  }
}

module.exports = {
  httpGetAllPlanets,
};
