const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  const { koi_disposition, koi_insol, koi_prad } = planet;

  return (
    koi_disposition === "CONFIRMED" &&
    koi_insol > 0.36 &&
    koi_insol < 1.11 &&
    koi_prad < 1.6
  );
}

function loadData() {
  return new Promise((res, rej) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    ).pipe(
      parse({
        comment: "#",
        columns: true,
      })
        .on("data", (data) => {
          if (!isHabitablePlanet(data)) {
            return;
          }

          habitablePlanets.push(data["kepler_name"]);
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

(async () => await loadData())();

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  getAllPlanets,
};
