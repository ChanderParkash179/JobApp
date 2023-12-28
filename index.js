const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors")

dotenv.config({ path: './configurations/.env' });

const PORT = process.env.PORT || 8080;
const app = express();


app.listen(PORT, () => console.log(`server started in ${process.env.DEV_MODE} Mode on PORT => ${PORT}`.bgCyan.black));