const mongoose = require('mongoose');
var setting_data = mongoose.Schema({
    title: {
        type: String
    },
    desc: {
        type: String
    },
    logo: {
        type: String
    },
    fav: {
        type: String
    },
    domain: {
        type: String
    },
    keyword: {
        type: String
    },
    contact: {
        type: String
    },
    popup: {
        type: String
    },
    like: {
        type: String
    },
    key: [{
        termgame: {
            type: String
        },
        byshop: {
            type: String
        },
        pumlf: {
            type: String
        },
    }]
}, {
    collection: "setting",
    versionKey: false
});

var ru6su6 = mongoose.models.setting || mongoose.model("setting", setting_data);
module.exports = ru6su6;