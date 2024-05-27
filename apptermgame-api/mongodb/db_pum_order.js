const mongoose = require('mongoose');
var pum_order_data = mongoose.Schema({
    user: {
        type: String
    },
    order: {
        type: String
    },
    charge: {
        type: String
    },
    service: {
        type: String
    },
    name: {
        type: String
    },
    link: {
        type: String
    },
    amount: {
        type: String
    }
}, {
    collection: "pum_order",
    versionKey: false
});

var ru6su6 = mongoose.models.pum_order || mongoose.model("pum_order", pum_order_data);
module.exports = ru6su6;