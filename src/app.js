const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();

//Middlewares
app.use(
  cors({
    origin: "http://localhost",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Endpoints
app.use("/v1", api);
app.get("/*", (req, res) => res.status(404).json({ error: "Page Not Found" }));

module.exports = app;
