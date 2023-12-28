const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const { mongoConnect } = require("./src/database/connection")

// .ENV configuration
dotenv.config({ path: './src/configurations/.env' });

// port declaration
const PORT = process.env.PORT || 8080;
// app initialization
const app = express();

// connect mongodb
mongoConnect(process.env.DB_LOCAL_URL).then(() =>
  console.log(`database connection connected successfully!`.bgYellow.black)
);


app.listen(PORT, () => console.log(`server started in ${process.env.DEV_MODE} Mode on PORT => ${PORT}`.bgCyan.black));