const mongoose = require('mongoose');
var logs_data = mongoose.Schema({
    user: {
        type: String
    },
    desc: {
        type: String
    },
    type: {
        type: String
    },
    time: {
        type: String
    }
}, {
    collection: "logs",
    versionKey: false
});

var ru6su6 = mongoose.models.logs || mongoose.model("logs", logs_data);
module.exports = ru6su6;