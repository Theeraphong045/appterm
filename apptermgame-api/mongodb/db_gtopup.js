const mongoose = require('mongoose');
var gtopup_data = mongoose.Schema({
    company_id: {
        type: String
    },
    company_name: {
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
    },
    input: {
        type: String
    },
    help: {
        type: String
    }
}, {
    collection: "gtopup",
    versionKey: false
});

var ru6su6 = mongoose.models.gtopup || mongoose.model("gtopup", gtopup_data);
module.exports = ru6su6;