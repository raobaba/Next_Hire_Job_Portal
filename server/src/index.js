const express = require("express");
const Connection = require("./config/db");
const app = express();

Connection();
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
