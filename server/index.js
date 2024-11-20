require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const pino = require("pino-http");
const mongoose = require("mongoose");
const userRoute = require("./src/routes/user.routes");
const { errorHandler } = require("./src/middleware/error-handler.middleware");
const generateVapidKeys = require("./src/utils/web-push.util");
// initialize express
const app = express();
const corsOptionsDelegate = require("./src/config/config");

app.use(cors(corsOptionsDelegate));
// middlewares
app.use(helmet()); // for security
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "src", "public"))); // for serving static files from public folder
app.use(
  pino({
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
    level: process.env.LOG_LEVEL || "info",
  })
);
// use the static files
app.use(express.static(path.join(__dirname, "src", "public")));

// ping route
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// routes are defined here
app.use("/api", userRoute);
app.use("/api", require("./src/routes/subscribe.routes"));

// error handler middleware
app.use(errorHandler);

app.all("*", (req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "src", "views", "error.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Process started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
