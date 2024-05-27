const mongoose = require('mongoose');
var gtopup_logs_data = mongoose.Schema({
    user: {
        type: String
    },
    transaction_id: {
        type: String
    },
    company_id: {
        type: String
    },
    uid: {
        type: String
    },
    desc: {
        type: String
    },
    price: {
        type: String
    },
    total: {
        type: String
    },
    time: {
        type: String
    }
}, {
    collection: "gtopup_logs",
    versionKey: false
});

var ru6su6 = mongoose.models.gtopup_logs || mongoose.model("gtopup_logs", gtopup_logs_data);
module.exports = ru6su6;