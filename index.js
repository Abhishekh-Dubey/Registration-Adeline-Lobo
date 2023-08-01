const express = require("express");

const dotenv = require("dotenv");
const { connect } = require("mongoose");
const app = express();

// env connection
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;
// databaase connection
require("./db/MongoConnet");

// router connection
app.use(express.json());
app.use(require("./Routers/Rout"));

app.listen(PORT, () => console.log(`I am running on port ${PORT}....`));
