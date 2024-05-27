const mongoose = require('mongoose');
var order_data = mongoose.Schema({
    user: {
        type: String
    },
    amount: {
        type: Number
    },
    time: {
        type: String
    },
    status: {
        type: Number
    },
    referenceNo: {
        type: String
    },
    img: {
        type: String
    },
    gbpReferenceNo: {
        type: String
    },
    customerName: {
        type: String
    }
}, {
    collection: "order",
    versionKey: false
});

var ru6su6 = mongoose.models.order || mongoose.model("order", order_data);
module.exports = ru6su6;