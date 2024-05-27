// const crypto = require("crypto");
import crypto from "crypto";

function Pwd(data) {
    if (!(this instanceof Pwd)) {
        return new Pwd(data);
    }
    this.data = data;
}

Pwd.prototype.verify = async function (db, pwd) {
    const tmp = db.split("$");
    return (crypto.createHash("sha256").update(crypto.createHash("sha256").update(pwd).digest("hex") + tmp[2]).digest("hex") == tmp[3])
}

Pwd.prototype.generate = async function (pwd) {
    const r = Math.random().toString(36).substring(16);
    return "$SHA$" + r + "$" + crypto.createHash("sha256").update(crypto.createHash("sha256").update(pwd).digest("hex") + r).digest("hex")
}

// module.exports = Pwd;
export default Pwd;
