// import
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const router = require("./src/routes/index");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const ErrorMiddleware = require("./src/middleware/error");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const pdf = require("html-pdf");
const pdfTemplate = require("./src/document/index");
// initialize
const app = express();

// use
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

app.use("/api/v1", router);

// error handler route
app.use(ErrorMiddleware);

app.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile("content.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
});

app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/content.pdf`);
});

// Undefined Route

app.use("*", (req, res) => {
  res.status(404).json({ status: "Failure", data: "Not Found" });
});

module.exports = app;
