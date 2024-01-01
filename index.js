// package imports
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");

// security imports
const helmet = require("helmet");
const xss = require("xss-clean");
const mongosanitize = require("express-mongo-sanitize");
const { rateLimit } = require("express-rate-limit");

// file imports
const { mongoConnect } = require("./src/database/connection");
const test_router = require("./src/routers/test.router");
const auth_router = require("./src/routers/auth.router");
const user_router = require("./src/routers/user.router");
const job_router = require("./src/routers/job.router");
const { restrict } = require("./src/middlewares/restrict.middleware");

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

// function of rate-limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

// middlewares
app.use(helmet(``));
app.use(xss());
app.use(mongosanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/test", test_router);
app.use("/auth", auth_router);
app.use("/user", [restrict, limiter], user_router);
app.use("/job", restrict, job_router);

// app listeners
app.listen(PORT, () => console.log(`server started in ${process.env.DEV_MODE} Mode on PORT => ${PORT}`.bgCyan.black));