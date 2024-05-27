const mongoose = require('mongoose');
var product_data = mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: String
    },
    img: {
        type: String
    },
    desc: {
        type: String
    }
}, {
    collection: "product",
    versionKey: false
});

var ru6su6 = mongoose.models.product || mongoose.model("product", product_data);
module.exports = ru6su6;