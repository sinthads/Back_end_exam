const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const { userRouter, movieRouter } = require("./router");
const bearerToken = require("express-bearer-token");

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bearerToken());

const response = (req, res) =>
  res.status(200).send("<h1>Rest API Back-End-Exam</h1>");

app.get("/", response);
app.use("/user", userRouter);
app.use("/movies", movieRouter);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`CONNECTED: PORT ${PORT}`));
