const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const host = "localhost";
const mongoose = require("mongoose");
const Router = require("./Route");
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: "*" }));

app.use("/", Router);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("estore/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "estore", "build", "index.html"));
  });
}
mongoose
  .connect(
    "mongodb+srv://pranav:pranan@cluster0.zl2ix.mongodb.net/project?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => {
    app.listen(port, host, () => {
      console.log(`server run on ${port}`);
      console.log(process.env.NODE_ENV);
    });
  })
  .catch((res) => {
    console.log("error");
    console.log(res);
  });
