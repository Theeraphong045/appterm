const mongoose = require('mongoose');
var announce_data = mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    content: {
        type: String
    },
    time: {
        type: String
    },
}, {
    collection: "announce",
    versionKey: false
});

var noname = mongoose.models.announce || mongoose.model("announce", announce_data);
module.exports = noname;