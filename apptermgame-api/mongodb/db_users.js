const mongoose = require('mongoose');

var users_data = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    credit: {
        type: Number
    },
    permission: {
        type: Number
    },
    jwt_token: {
        type: String
    }
}, {
    collection: "users",
    versionKey: false
});

var noname = mongoose.models.users || mongoose.model("users", users_data);
module.exports = noname;