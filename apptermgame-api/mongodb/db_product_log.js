const mongoose = require('mongoose');
var product_logs_data = mongoose.Schema({
    user: {
        type: String
    },
    order_id: {
        type: String
    },
    id: {
        type: String
    },
    real_price: {
        type: String
    },
    price: {
        type: String
    },
    desc: {
        type: String
    },
    time: {
        type: String
    },
}, {
    collection: "product_logs",
    versionKey: false
});

var ru6su6 = mongoose.models.product_logs || mongoose.model("product_logs", product_logs_data);
module.exports = ru6su6;