// package imports
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");

// file imports
const { mongoConnect } = require("./src/database/connection");
const test_router = require("./src/routers/test.router");

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

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/test", test_router);

// app listeners
app.listen(PORT, () => console.log(`server started in ${process.env.DEV_MODE} Mode on PORT => ${PORT}`.bgCyan.black));