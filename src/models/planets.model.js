const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  const { koi_disposition, koi_insol, koi_prad } = planet;

  return (
    koi_disposition === "CONFIRMED" &&
    koi_insol > 0.36 &&
    koi_insol < 1.11 &&
    koi_prad < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((res, rej) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    ).pipe(
      parse({
        comment: "#",
        columns: true,
      })
        .on("data", async (data) => {
          if (!isHabitablePlanet(data)) {
            return;
          }

          await savePlanet(data);
        })
        .on("error", (err) => {
          console.log("ERROR", err);
          rej(err);
        })
        .on("end", () => {
          res();
        })
    );
  });
}

async function getAllPlanets() {
  try {
    return planets.find(
      {},
      {
        _id: 0,
        keplerName: 1,
      }
    );
  } catch (error) {
    console.error("Could not retrieve planets: " + error);
    throw error;
  }
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error("Could not save the planet: " + error);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
