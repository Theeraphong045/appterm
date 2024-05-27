const express = require("express");
const app = express();
const router = express.Router();
var mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

var mongo_uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, { useNewUrlParser: true }).then(
    () => {
        console.log("[success] : connected to the database ");
    },
    (error) => {
        console.log("[failed] " + error);
        process.exit();
    }
);
app.use(cors());
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var mongoza = mongoose;
module.exports = mongoza;