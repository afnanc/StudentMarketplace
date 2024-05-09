const express = require("express");
const adRouter = require("./routes/adRoutes");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
dotenv.config({ path: "./.env" });

const app = express();

// Web Security Measures
app.use(cors());
app.enable("trust proxy");
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Middleware
app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use("/img", express.static("public/img")); // Updated line

// Routes
app.use("/api/ads", adRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
