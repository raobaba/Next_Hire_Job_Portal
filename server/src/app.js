const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Connection = require("./config/db");
const userRouter = require("./routes/user.route");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());

Connection();
app.use("/api/v1/user", userRouter);
console.log(app.listenerCount("connection"));
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
