const express = require('express')
const cors = require('cors');
const app = express()
const axios = require('axios')
require('dotenv').config()
const mongoose = require('mongoose')
const db_users = require('./mongodb/db_users')
const db_setting = require('./mongodb/db_setting')
const db_logs = require('./mongodb/db_logs')
const db_gtopup = require('./mongodb/db_gtopup')
const db_gtopup_log = require('./mongodb/db_gtopup_log')
const db_product = require('./mongodb/db_product')
const db_product_log = require('./mongodb/db_product_log')
const db_announce = require('./mongodb/db_announce')
const db_order = require('./mongodb/db_order')
const db_pum_order = require('./mongodb/db_pum_order')
const date_time = require('./ess/datetime')
const datetime = new date_time()
const jwt = require('jsonwebtoken')
const moment = require('moment');

const fs = require('fs');
const path = require('path');

const generate = require('./ess/pwd')
const pwd = new generate();


var mongo_uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, { useNewUrlParser: true }).then(
    () => {
        console.log("[success] : connected to the database ");
    },
    (error) => {
        console.log("[failed] " + error);
        process.exit();
    }
);

app.use(express.json())

const corsOptions = {
    origin: 'https://leader-fox.net',
    credentials: true,
};
app.use(cors());

function isEmpty(str) {
    return (!str || str.length === 0);
}

// Get Setting
app.get('/setting', async (req, res) => {
    const setting = await db_setting.findOne().select('-key -_id')
    if (setting) {
        return res.status(200).json(setting)
    } else {
        return res.status(200).json({ install: 0 })
    }
})
// Get Announce
app.get('/announce', async (req, res) => {
    const setting = await db_announce.find()
    return res.status(200).json(setting)
})

// Install
app.post('/install', async (req, res) => {
    var now = await datetime.now()
    if (isEmpty(req.body?.Token)) return res.status(500).json({ msg: 'ไม่สามารถยืนยัน CAPTCHA ได้' })
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const token = req.body.Token;

    const formData = new FormData();
    formData.append('secret', process.env.NEXT_PUBLIC_CF_SKey);
    formData.append('response', token);

    try {
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        if (outcome.success) {
            const setting = await db_setting.findOne()
            if (setting) return res.status(500).json({ msg: 'เว็บไซต์ถูกติดตั้งไปแล้ว' })

            try {
                const pwd = new generate()
                const { email, username, password, Title, Desc, Domain, Logo, Fav, Keyword, Contact, Termgame, Byshop, Pumlf } = req.body
                if (
                    isEmpty(email) &&
                    isEmpty(username) &&
                    isEmpty(password) &&
                    isEmpty(Title) &&
                    isEmpty(Desc) &&
                    isEmpty(Domain) &&
                    isEmpty(Logo) &&
                    isEmpty(Fav) &&
                    isEmpty(Termgame) &&
                    isEmpty(Byshop) &&
                    isEmpty(Pumlf) &&
                    isEmpty(Contact)
                ) return res.status(500).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' })

                const password_new = await pwd.generate(password)

                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const validateEmail = (email) => (re.test(email))
                if (!validateEmail(email)) return res.status(500).json({ msg: "Email ไม่ถูกต้อง" })
                if (password.length < 8) return res.status(500).json({ msg: "รหัสผ่านต้องมีความยาว 8 ตัวขึ้นไป" })
                var jwt_token = await jwt.sign({ em: email, dev: 'RU6SU6.CLOUD' }, process.env.JWT_SECRET, { expiresIn: '1d' })
                const user = new db_users({
                    username: username,
                    email: email,
                    password: password_new,
                    credit: 0,
                    permission: 0,
                    jwt_token: jwt_token,
                })

                await user.save()

                await db_setting.collection.insertOne({
                    title: Title,
                    desc: Desc,
                    logo: Logo,
                    fav: Fav,
                    domain: Domain,
                    contact: Contact,
                    keyword: Keyword,
                    key: {
                        termgame: Termgame,
                        byshop: Byshop,
                        punlf: Pumlf
                    }
                });
                await db_logs.collection.insertOne({
                    user: user.insertedId,
                    desc: 'ติดตั้งเว็บไซต์',
                    type: 'admin',
                    time: now,
                });

                res.status(200).json({ msg: 'ติดตั้งเว็บไซต์สำเร็จ', token: jwt_token })
            } catch (e) {
                console.log(e)
                res.status(500).json({ msg: e })
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "กรุณายืนยัน CAPTCHA" });
    }
})

// Auth
app.post('/auth/signup', async (req, res) => {
    var now = await datetime.now()
    if (isEmpty(req.body?.Token)) return res.status(500).json({ msg: 'ไม่สามารถยืนยัน CAPTCHA ได้' })
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const token = req.body.Token;

    const formData = new FormData();
    formData.append('secret', process.env.NEXT_PUBLIC_CF_SKey);
    formData.append('response', token);

    try {
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        if (outcome.success) {
            if (
                isEmpty(req.body.emali),
                isEmpty(req.body.username),
                isEmpty(req.body.password)
            ) return res.status(500).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
            if (req.body.password.length < 8) return res.status(500).json({ msg: "รหัสผ่านต้องมีความยาวมากกว่า 8ตัว" })

            const userdb = await db_users.findOne({ username: req.body.username })
            if (userdb) return res.status(500).json({ msg: 'Username นี้ถูกใช้ไปแล้ว' })

            const newPass = await pwd.generate(req.body.password)
            const user = new db_users({
                username: req.body.username,
                email: req.body.email,
                password: newPass,
                credit: 0,
                permission: 0,
                jwt_token: null,
            })

            await user.save()
            res.status(200).json({ msg: 'สมัครสมาชิคสำเร็จ' })
        }
    } catch (err) {
        res.status(500).json({ msg: "กรุณายืนยัน CAPTCHA" });
        console.error(err);
    }

})

app.post('/auth/signin', async (req, res) => {
    var now = await datetime.now()
    if (isEmpty(req.body?.Token)) return res.status(500).json({ msg: 'ไม่สามารถยืนยัน CAPTCHA ได้' })
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const token = req.body.Token;

    const formData = new FormData();
    formData.append('secret', process.env.NEXT_PUBLIC_CF_SKey);
    formData.append('response', token);

    try {
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        if (outcome.success) {
            if (
                isEmpty(req.body.username),
                isEmpty(req.body.password)
            ) return res.status(500).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
            if (req.body.password.length < 8) return res.status(500).json({ msg: "รหัสผ่านต้องมีความยาวมากกว่า 8ตัว" })
            const userdb = await db_users.findOne({ username: req.body.username })
            if (!userdb) return res.status(500).json({ msg: 'ไม่พบบัญชี' })
            const verifyPass = await pwd.verify(userdb.password, req.body.password)
            if (!verifyPass) return res.status(500).json({ msg: 'รหัสผ่านไม่ถูกต้อง' })
            const jwt_token = await jwt.sign({ id: userdb._id, email: userdb.email, dev: 'RU6SU6.CLOUD' }, process.env.JWT_SECRET, { expiresIn: '1d' })
            await db_users.findOneAndUpdate({ _id: userdb._id }, { jwt_token: jwt_token })
            return res.status(200).json({ msg: 'เข้าสู่ระบบสำเร็จ', token: jwt_token })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "กรุณายืนยัน CAPTCHA" });
    }
})


// Get User Data
app.get('/userdata', async (req, res) => {
    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!isEmpty(token)) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                if (err) {
                    res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                } else {
                    db_users.findOne({ jwt_token: token })
                        .select('-password')
                        .exec((error, result) => {
                            if (error) {
                                res.status(500).json({ msg: error });
                            } else {
                                if (!result) {
                                    res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                                } else {
                                    if (result === null) {
                                        res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                    } else {
                                        res.status(200).json(result)
                                    }
                                }
                            }
                        });
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})

// Get History
app.get('/history', async (req, res) => {

    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!isEmpty(token)) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                if (err) {
                    res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                } else {
                    db_users.findOne({ jwt_token: token })
                        .select('-password')
                        .exec(async (error, result) => {
                            if (error) {
                                res.status(500).json({ msg: error });
                            } else {
                                if (!result) {
                                    res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                                } else {
                                    if (result === null) {
                                        res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                    } else {
                                        const setting = await db_setting.findOne()
                                        const termgame = await db_gtopup_log.find({ user: result._id }).select('-total')
                                        const pum = await db_pum_order.find({ user: result._id })
                                        const logs = await db_logs.find({ user: result._id, type: 'user' })
                                        const game = await db_gtopup.find()

                                        const tg = await Promise.all(termgame.map(async (d, i) => {
                                            const data = game.filter(p => p.company_id === String(d.company_id));
                                            return {
                                                _id: d._id,
                                                transaction_id: d.transaction_id,
                                                user: d.user,
                                                company_id: d.company_id,
                                                company_name: data[0]?.company_name,
                                                uid: d.uid,
                                                desc: d.desc,
                                                price: d.price,
                                                time: d.time,

                                            }
                                        }))

                                        const data_pum = await Promise.all(pum.map(async (d, i) => {
                                            const ress = await axios.post(process.env.PUMLF_API, {
                                                key: setting.key[0].pumlf,
                                                action: 'status',
                                                order: d.order
                                            }, {
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                }
                                            })
                                            if (ress.status == 200) return { _id: d?._id, name: d?.name, link: d?.link, order: d?.order, charge: d?.charge, start_count: ress.data.start_count, status: ress.data.status, remains: ress.data.remains, currency: ress.data.currency }
                                        }))
                                        axios.post('https://byshop.me/api/history', { keyapi: setting.key[0].byshop, username_customer: result.username }, {
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                            }
                                        })
                                            .then(async (ress) => {
                                                const data = await Promise.all(ress.data.map(async (d, i) => {
                                                    return {
                                                        email: d.email,
                                                        id: d.id,
                                                        name: d.name,
                                                        password: d.password,
                                                        price: d.price,
                                                        report: d.report,
                                                        status_fix: d.status_fix,
                                                        time: d.time,
                                                    }
                                                }))

                                                res.status(200).json({ app: data, termgame: tg.reverse(), logs: logs.reverse(), pum: data_pum.reverse() })
                                            })
                                            .catch((e) => {
                                                console.log(e)
                                                res.status(500).json()
                                            })
                                    }
                                }
                            }
                        });
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})

app.put('/changepassword', async (req, res) => {

    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!isEmpty(token)) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                if (err) {
                    res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                } else {
                    db_users.findOne({ jwt_token: token })
                        .exec(async (error, result) => {
                            if (error) {
                                res.status(500).json({ msg: error });
                            } else {
                                if (!result) {
                                    res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                                } else {
                                    if (result === null) {
                                        res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                    } else {
                                        const password_verify = await pwd.verify(result.password, req.body.oldpassword)
                                        if (!password_verify) return res.status(500).json({ msg: "รหัสผ่านเก่าไม่ถูกต้อง" })
                                        const password_new = await pwd.generate(req.body.password)
                                        await db_users.findOneAndUpdate({ _id: result._id }, {
                                            password: password_new
                                        });
                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `เปลี่ยนรหัสผ่าน`,
                                            type: 'user',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: `เปลี่ยนรหัสผ่านสำเร็จ` })
                                    }
                                }
                            }
                        });
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})

app.post('/payment/tw', async (req, res) => {
    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!isEmpty(token)) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                if (err) {
                    res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                } else {
                    db_users.findOne({ jwt_token: token })
                        .select('-password')
                        .exec(async (error, result) => {
                            if (error) {
                                res.status(500).json({ msg: error });
                            } else {
                                if (!result) {
                                    res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                                } else {
                                    if (result === null) {
                                        res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                    } else {
                                        if (!req.body.Payload) return res.status(500).json({ msg: 'กรุณากรอกลิงก์' })
                                        const b = await redeemvouchers(process.env.Wallet_Num, req.body.Payload);
                                        if (b.status !== "SUCCESS") return res.status(500).json({ msg: 'ลิงก์ซองของขวัญไม่ถูกต้อง' })

                                        const percentage = 2.5 / 100;
                                        const number = b.amount;

                                        const amount_last = number - (number * percentage);


                                        await db_users.updateOne(
                                            { _id: result._id },
                                            { $set: { credit: result.credit + amount_last } },
                                            (error, categoryResult) => {
                                                if (error) {
                                                    return res.status(500).json({ msg: error })
                                                }
                                            }
                                        );
                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `เติมเงินผ่าน ซองของขวัญ จำนวน: ${amount_last} บาท`,
                                            type: 'user',
                                            time: now,
                                        });

                                        return res.status(200).json({ msg: 'เติมเงินสำเร็จ' })
                                    }
                                }
                            }
                        });
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})

app.post('/payment/qrcode', async (req, res) => {
    try {
        var now = await datetime.now()
        var token = req.headers.authorization;

        if (!isEmpty(token)) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                if (err) {
                    res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                } else {
                    db_users.findOne({ jwt_token: token })
                        .select('-password')
                        .exec(async (error, result) => {
                            if (error) {
                                res.status(500).json({ msg: error });
                            } else {
                                if (!result) {
                                    res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                                } else {
                                    if (result === null) {
                                        res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                    } else {
                                        if (!req.body.amount) return res.status(500).json({ msg: 'กรุณากรอกจำนวนเงิน' })
                                        function formatNumberString(numberString) {
                                            const number = Number(numberString);
                                            return number.toFixed(2);
                                        }
                                        const referenceNo = now.replace(/[^0-9]/g, "")
                                        const result1 = await formatNumberString(req.body.amount);
                                        try {
                                            const response = await axios.post(`${process.env.GB_API}/v3/qrcode`, {
                                                token: process.env.GB_TOKEN,
                                                amount: result1,
                                                referenceNo,
                                                backgroundUrl: 'https://7ef2-58-8-41-173.ngrok-free.app/gb_webhook'
                                            }, {
                                                headers: {
                                                    "Content-Type": "application/x-www-form-urlencoded"
                                                },
                                                responseType: 'arraybuffer'
                                            });

                                            const base64Output = Buffer.from(response.data).toString('base64');
                                            const body = `data:image/png;base64,${base64Output}`;

                                            db_order.collection.insertOne({
                                                user: String(result._id),
                                                amount: req.body.amount,
                                                time: now,
                                                status: 0,
                                                referenceNo,
                                                img: body
                                            }, async (error, result) => {
                                                if (error) {
                                                    res.status(500).json({ msg: error });
                                                } else {
                                                    res.status(200).json({ msg: 'สร้าง QRCODE สำเร็จ', img: body, referenceNo: referenceNo });
                                                }
                                            });
                                        } catch (error) {
                                            console.error('Error fetching QR code:', error);
                                            res.status(500).send('Error fetching QR code');
                                        }
                                    }
                                }
                            }
                        });
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})
app.get('/payment/qr/:id', async (req, res) => {

    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!isEmpty(token)) {
            jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                if (err) {
                    res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                } else {
                    db_users.findOne({ jwt_token: token })
                        .select('-password')
                        .exec(async (error, result) => {
                            if (error) {
                                res.status(500).json({ msg: error });
                            } else {
                                if (!result) {
                                    res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                                } else {
                                    if (result === null) {
                                        res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                    } else {
                                        console.log(req.params.id)
                                        const db = await db_order.findOne({ referenceNo: req.params.id })
                                        res.status(200).json(db)
                                    }
                                }
                            }
                        });
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})

app.post('/gb_webhook', async (req, res) => {
    var now = await datetime.now()

    const db = await db_order.findOne({ referenceNo: req.body.referenceNo })
    if (!db) return res.status(500).json({ msg: 'ไม่พบข้อมูล' })
    const result = await db_users.findOne({ _id: db.user })

    await db_users.updateOne(
        { _id: result._id },
        { $set: { credit: result.credit + db.amount } },
        (error, categoryResult) => {
            if (error) {
                return res.status(500).json({ msg: error })
            }
        }
    );
    await db_order.updateOne(
        { _id: db._id },
        { $set: { status: 1, gbpReferenceNo: req.body.gbpReferenceNo, customerName: req.body.customerName } },
        (error, categoryResult) => {
            if (error) {
                return res.status(500).json({ msg: error })
            }
        }
    );
    await db_logs.collection.insertOne({
        user: String(result._id),
        desc: `เติมเงินผ่าน พร้อมเพย์ จำนวน: ${db.amount} บาท`,
        type: 'user',
        time: now,
    });

    return res.status(200).json({ msg: 'เติมเงินสำเร็จ' })
})


app.get('/termgame/list', async (req, res) => {
    var now = await datetime.now()
    const in_db = await db_gtopup.find()
    const setting = await db_setting.findOne()
    axios.post('https://api.ru6su6.cloud/api/wepay', {
        key: setting.key[0].termgame,
        action: 'get_gtopup'
    }).then(async (result) => {

        const data = await Promise.all(in_db.map(async (d, i) => {
            const data = result.data.filter(p => p?.company_id === String(d?.company_id));
            const dd = data[0]
            delete dd['cashback']
            return {
                _id: d._id,
                company_id: d.company_id,
                company_name: d?.company_name || dd?.company_name,
                img: d.img,
                price: d.price,
                desc: d.desc,
                input: d.input,
                help: d.help
            }
        }))

        res.status(200).json(data.reverse())
    })
        .catch((e) => {
            console.log(e)
            res.status(500).json({ msg: e })
        })
})

app.get('/termgame/:id', async (req, res) => {
    try {
        var now = await datetime.now()
        const in_db = await db_gtopup.findOne({ _id: req.params.id })
        const setting = await db_setting.findOne()
        axios.post('https://api.ru6su6.cloud/api/wepay', {
            key: setting.key[0].termgame,
            action: 'get_gtopup'
        }).then(async (result) => {

            const data = result.data.filter(p => p.company_id === String(in_db.company_id));
            const dd = data[0]
            delete dd['cashback']

            res.status(200).json({ ...dd, db: in_db })
        })
            .catch((e) => {
                console.log(e)
                res.status(500).json({ msg: e })
            })
    } catch (e) {
        console.log(e)
    }
})

// เติมเกม WAITING-TEST
app.post('/termgame', async (req, res) => {
    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!token) return res.status(500).json({ msg: 'กรุณาเข้าสู่ระบบก่อน' })
        const user = await db_users.findOne({ jwt_token: token })
        if (!user) return res.status(500).json({ msg: 'กรุณาเข้าสู่ระบบก่อน' })
        const setting = await db_setting.findOne()

        const { P, Ref1, Ref2, amount, select, desc } = req.body
        const db = await db_gtopup.findOne({ company_id: select })
        const price_cal = (d) => {
            if (Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[0]?.replace(/[^0-9]/g, "")) == 0) {
                return Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[1]?.replace(/[^0-9]/g, "")) - (Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[1]?.replace(/[^0-9]/g, "")) * (db?.price / 100))
            } else {
                return Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[0]?.replace(/[^0-9]/g, "")) - (Number(d?.description?.replace('<b>', '')?.split('บาท')[0]?.split('</b> ')[0]?.replace(/[^0-9]/g, "")) * (db?.price / 100))
            }
        }

        await axios.post('https://api.ru6su6.cloud/api/wepay', {
            key: setting.key[0].termgame,
            action: 'get_gtopup'
        }).then(async (result) => {
            const data = result.data.filter(p => p.company_id === String(db.company_id));
            if ((user.credit - price_cal(data[0].denomination[amount])) < 0) return res.status(500).json({ msg: 'เงินคงเหลือไม่เพียงพอ' })
            axios.post('https://api.ru6su6.cloud/api/wepay', {
                key: setting.key[0].termgame,
                action: 'payment',
                type: 'gtopup',
                dest_ref: 'INV' + now.replace(/[^0-9]/g, ""),
                pay_to_amount: data[0].denomination[amount].price,
                pay_to_company: data[0].company_id,
                pay_to_ref1: Ref2 ? Ref1 + ' ' + Ref2 : Ref1,
                // pay_to_ref2: Ref2,
                price: data[0].denomination[amount].price
            })
                .then(async (d) => {
                    await db_users.findOneAndUpdate({ _id: user._id }, { credit: user.credit - price_cal(data[0].denomination[amount]) });
                    await db_gtopup_log.collection.insertOne({
                        user: String(user._id),
                        transaction_id: d.data.transaction_id,
                        company_id: data[0].company_id,
                        uid: Ref1,
                        id: app.id,
                        desc: desc,
                        price: price_cal(data[0].denomination[amount]),
                        total: d.data.total_amount,
                        time: now,
                    });

                    await db_logs.collection.insertOne({
                        user: String(user._id),
                        desc: `เติมเกม Order ID : ${d.data.transaction_id}`,
                        type: 'user',
                        time: now,
                    });

                    res.status(200).json({ msg: 'เติมเงินสำเร็จ' })
                })
                .catch((e) => {
                    console.log(e.response.data)
                    res.status(500).json({ msg: e.response.data.msg || e.response.data.message })
                })
        })
            .catch((e) => {
                console.log(e)
                res.status(500).json({ msg: 'เกิดข้อผิดพลาดจากเซิฟเวอร์ (Error Code : RSTMSERVER)' })
            })
    } catch (e) {
        console.log(e)
    }
    // res.status(200).json()
})

app.get('/app/list', async (req, res) => {
    try {
        var now = await datetime.now()
        const in_db = await db_gtopup.find()
        const setting = await db_setting.findOne()
        const result = await axios.get(`https://byshop.me/api/product`)

        const db = await db_product.find()
        const data = await Promise.all(result.data.map(async (d, i) => {
            const ress = db.filter(p => p.id === String(d.id));

            if (ress[0]) return { _id: ress[0]?._id, id: ress[0]?.id, name: ress[0]?.name, price: ress[0]?.price, img: ress[0]?.img, desc: ress[0]?.desc, stock: d.stock }
        }))


        data.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ทำให้เป็นพิมพ์ใหญ่ทั้งหมดเพื่อให้การเปรียบเทียบเป็นไปตามต้องการ
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0; // ชื่อเท่ากัน
        });

        let filteredData = data.filter(item => item !== undefined);
        res.status(200).json(filteredData.reverse())
    } catch (e) {
        console.log(e)
    }
})

app.get('/app/last', async (req, res) => {
    try {
        const setting = await db_setting.findOne()
        const result = await axios.post(`https://byshop.me/api/history`, {
            keyapi: setting.key[0].byshop
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        const db = await db_product.find()
        const db_log = await db_product_log.find()
        const data = await Promise.all(result.data.map(async (d) => {
            const order = await db_log.filter((i) => i.order_id == d.id)
            // const app = await db.filter((i) => i.id == order[0].id)

            const input = moment(d.time);
            const now = moment();

            const diff = now.diff(input, 'seconds');

            if (diff < 60) {
                d.time = `${diff} นาทีที่แล้ว`;
            } else if (diff < 3600) {
                d.time = `${Math.floor(diff / 60)} นาทีที่แล้ว`;
            } else if (diff < 86400) {
                d.time = `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
            } else {
                d.time = `${Math.floor(diff / 86400)} วันที่แล้ว`;
            }

            // d.img = app[0].img
            // d.name = app[0].name
            d.email = ''
            d.password = ''
            d.username = ''
            d.username_customer = ''
            return d
        }))
        res.status(200).json(data.reverse())
    } catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})

app.post('/buy/app', async (req, res) => {
    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!token) return res.status(500).json({ msg: 'กรุณาเข้าสู่ระบบก่อน' })
        const user = await db_users.findOne({ jwt_token: token })
        if (!user) return res.status(500).json({ msg: 'กรุณาเข้าสู่ระบบก่อน' })
        const setting = await db_setting.findOne()
        const app = await db_product.findOne({ _id: req.body.id })
        if ((user.credit - app.price) < 0) return res.status(500).json({ msg: 'เงินคงเหลือไม่เพียงพอ' })
        await axios.post('https://byshop.me/api/buy', {
            keyapi: setting.key[0].byshop,
            id: app.id,
            username_customer: user.username
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(async (result) => {
            if (result.data.status == 'error') {
                res.status(500).json({ msg: 'กรุณาติดต่อแอด (Error Code : RS3001)' })
            } else {
                await db_users.findOneAndUpdate({ _id: user._id }, { credit: user.credit - Number(app.price) });

                await db_logs.collection.insertOne({
                    user: String(user._id),
                    desc: `ซื้อแอปพรีเมี่ยม ${app.name} Order ID : ${result.data.orderid}`,
                    type: 'user',
                    time: now,
                });
                await db_product_log.collection.insertOne({
                    user: String(user._id),
                    order_id: result.data.orderid,
                    real_price: result.data.price,
                    id: app.id,
                    desc: result.data.info,
                    price: app.price,
                    time: now,
                });
                res.status(200).json({ msg: 'ซื้อแอปพรีเมี่ยมสำเร็จ' })
            }
            res.status(200).json()
        })
            .catch((e) => {
                console.log(e)
                res.status(500).json({ msg: e })
            })
    } catch (e) {
        console.log(e)
    }
})

app.post('/fix', async (req, res) => {
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        const { orderid, report_id } = req.body
        if (!isEmpty(token) && !isEmpty(orderid) && !isEmpty(report_id)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {

                                    axios.post('https://byshop.me/api/report_fix', { orderid: orderid, report_id: report_id }, {
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        }
                                    })
                                        .then(async (ress) => {
                                            switch (ress.data.status) {
                                                case 'error':
                                                    res.status(500).json({ msg: ress.data.message })
                                                    break
                                                case 'success':
                                                    res.status(200).json({ msg: ress.data.message })
                                                    break
                                            }
                                        })
                                        .catch((e) => {
                                            console.log(e)
                                            res.status(500).json()
                                        })
                                }
                            }
                        });
                    }
                }
            });
        }
    } catch (e) {
        console.log(e)
    }
})

app.post('/otp', async (req, res) => {
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        const { type } = req.body
        if (!isEmpty(token) && !isEmpty(type)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {

                                    axios.get(`https://byshop.me/api/otp_${type}`, {
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        }
                                    })
                                        .then(async (ress) => {
                                            res.status(200).json(ress.data)
                                        })
                                        .catch((e) => {
                                            console.log(e)
                                            res.status(500).json()
                                        })
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'not found', token, type })
        }
    } catch (e) {
        console.log(e)
    }
})


app.post('/buy/pum', async (req, res) => {
    try {
        var now = await datetime.now()
        var token = req.headers.authorization;
        if (!token) return res.status(500).json({ msg: 'กรุณาเข้าสู่ระบบก่อน' })
        const user = await db_users.findOne({ jwt_token: token })
        if (!user) return res.status(500).json({ msg: 'กรุณาเข้าสู่ระบบก่อน' })
        const setting = await db_setting.findOne()
        if (!req.body.service || !req.body.amount || !req.body.link || !req.body.name) return res.status(500).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
        if ((user.credit - (req.body.amount * setting.like)) < 0) return res.status(500).json({ msg: 'เงินคงเหลือไม่เพียงพอ' })
        await axios.post(process.env.PUMLF_API, {
            key: setting.key[0].pumlf,
            action: 'add',
            service: req.body.service,
            link: req.body.link,
            quantity: req.body.amount,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(async (result) => {
                await db_users.findOneAndUpdate({ _id: user._id }, { credit: user.credit - (req.body.amount * setting.like) });

                await db_logs.collection.insertOne({
                    user: String(user._id),
                    desc: `ปั๊มยอดไลค์ ${req.body.name} Order ID : ${result.data.order}`,
                    type: 'user',
                    time: now,
                });
                await db_pum_order.collection.insertOne({
                    user: String(user._id),
                    order: result.data.order,
                    charge: req.body.amount * setting.like,
                    name: req.body.name,
                    service: req.body.service,
                    link: req.body.link,
                    amount: req.body.amount,
                })
                res.status(200).json({ msg: 'ทำรายการปั๊มไลค์สำเร็จ' })
            })
            .catch((e) => {
                console.log(e)
                res.status(500).json({ msg: e })
            })
    } catch (e) {
        console.log(e)
    }
})


// Backoffice
// ดึงรายการประกาศ
app.get('/backoffice/announce', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        const data = await db_announce.find()
                                        res.status(200).json(data.reverse())
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด (Token)' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// เพิ่มประกาศ
app.post('/backoffice/announce', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        db_announce.collection.insertOne({
                                            title: req.body.Title,
                                            image: req.body.Image,
                                            content: req.body.Content,
                                            time: now,
                                        }, async (error) => {
                                            if (error) {
                                                res.status(500).json({ msg: error });
                                            } else {

                                                await db_logs.collection.insertOne({
                                                    user: String(result._id),
                                                    desc: `เพิ่มประกาศ ${req.body.title}`,
                                                    type: 'admin',
                                                    time: now,
                                                });
                                                res.status(200).json({ msg: 'เพิ่มประกาศสำเร็จ' })
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// อัพเดทประกาศ
app.put('/backoffice/announce', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        await db_announce.findOneAndUpdate({ _id: req.body.ID }, {
                                            title: req.body.Title,
                                            image: req.body.Image,
                                            content: req.body.Content,
                                        });

                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `แก้ไขประกาศ ${req.body.Title}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: 'แก้ไขประกาศสำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// ลบประกาศ
app.delete('/backoffice/announce', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        if (isEmpty(req.query.id)) return res.status(500).json({ msg: 'ไม่พบประกาศ' })
                                        await db_announce.deleteOne({ _id: req.query.id })
                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `ลบประกาศ ${req.body.title}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: 'ลบประกาศสำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// ดึงรายการเกม
app.get('/backoffice/termgame', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        const in_db = await db_gtopup.find()
                                        axios.post('https://api.ru6su6.cloud/api/wepay', {
                                            key: setting.key[0].termgame,
                                            action: 'get_gtopup'
                                        }).then(async (d) => {
                                            const data = await Promise.all(d.data.map(async (d, i) => {
                                                const db = in_db.filter(p => p.company_id === String(d.company_id));
                                                // if (i == 0) console.log(db, d)
                                                return { ...d, db: db[0] }
                                            }))
                                            res.status(200).json(data)
                                        })
                                            .catch((e) => {
                                                console.log(e)
                                                res.status(500).json({ msg: e })
                                            })
                                        // res.status(200).json({ app: { money: app?.data?.money || 0 }, ssm: { money: ssm?.data?.balance || 0, currency: ssm?.data?.currency || 'THB' } })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด (Token)' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// เพิ่มเกม
app.post('/backoffice/termgame', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        db_gtopup.findOne({ id: req.body.id }, (error, result1) => {
                                            if (error) {
                                                res.status(500).json({ msg: error });
                                            } else {
                                                if (!result1) {
                                                    db_gtopup.collection.insertOne({
                                                        company_id: req.body.id,
                                                        company_name: req.body.name,
                                                        img: req.body.img,
                                                        price: req.body.price,
                                                        desc: req.body.desc,
                                                        input: req.body.input,
                                                        help: req.body.help,
                                                    }, async (error) => {
                                                        if (error) {
                                                            res.status(500).json({ msg: error });
                                                        } else {

                                                            await db_logs.collection.insertOne({
                                                                user: String(result._id),
                                                                desc: `เพิ่มเกม ${req.body.name}`,
                                                                type: 'admin',
                                                                time: now,
                                                            });
                                                            res.status(200).json({ msg: 'เพิ่มเกมสำเร็จ' })
                                                        }
                                                    });
                                                } else {
                                                    res.status(500).json({ msg: `ไม่สามรถเพิ่มเกมได้ \n ( เนื่องจาก : มีเกมอยู่แล้ว )` })
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// อัพเดทเกม
app.put('/backoffice/termgame', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        await db_gtopup.findOneAndUpdate({ company_id: req.body.id }, {
                                            company_name: req.body.name,
                                            img: req.body.img,
                                            price: req.body.price,
                                            desc: req.body.desc,
                                            input: req.body.input,
                                            help: req.body.help
                                        });

                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `แก้ไขเกม ${req.body.name}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: 'แก้ไขเกมสำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// ลบเกม
app.delete('/backoffice/termgame', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        if (isEmpty(req.query.id)) return res.status(500).json({ msg: 'ไม่พบเกม' })
                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `ลบเกม ${req.body.name}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        await db_gtopup.deleteOne({ _id: req.query.id })
                                        res.status(200).json({ msg: 'ลบเกมสำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

app.get('/backoffice/app', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {

                                        const result = await axios.get(`https://byshop.me/api/product`)

                                        const data = await Promise.all(result.data.map(async (d, i) => {
                                            const ress = await db_product.find({ id: d?.id })
                                            // console.log(ress)
                                            return { api: d, db: ress[0] }
                                        }))

                                        res.status(200).json(data)
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// เพิ่มแอปพรีเมี่ยม
app.post('/backoffice/app', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        if (!req.body.price.split('.')[1]) return res.status(500).json({ msg: 'ระบุราคาไม่ถูกต้อง ( กรุณาระบุทศนิยม )' })
                                        db_product.findOne({ id: req.body.id }, (error, result1) => {
                                            if (error) {
                                                res.status(500).json({ msg: error });
                                            } else {
                                                if (!result1) {
                                                    db_product.collection.insertOne({
                                                        id: req.body.id,
                                                        name: req.body.name,
                                                        img: req.body.img,
                                                        price: req.body.price,
                                                        desc: req.body.desc,
                                                    }, async (error) => {
                                                        if (error) {
                                                            res.status(500).json({ msg: error });
                                                        } else {

                                                            await db_logs.collection.insertOne({
                                                                user: String(result._id),
                                                                desc: `เพิ่มแอปพรีเมี่ยม ${req.body.name}`,
                                                                type: 'admin',
                                                                time: now,
                                                            });
                                                            res.status(200).json({ msg: 'เพิ่มแอปพรีเมี่ยมสำเร็จ' })
                                                        }
                                                    });
                                                } else {
                                                    res.status(500).json({ msg: `ไม่สามรถเพิ่มแอปพรีเมี่ยมได้ \n ( เนื่องจาก : มีแอปพรีเมี่ยมอยู่แล้ว )` })
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// อัพเดทแอปพรีเมี่ยม
app.put('/backoffice/app', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        if (!req.body.price.split('.')[1]) return res.status(500).json({ msg: 'ระบุราคาไม่ถูกต้อง ( กรุณาระบุทศนิยม )' })
                                        await db_product.findOneAndUpdate({ _id: req.body.id }, { name: req.body.name, img: req.body.img, price: req.body.price, desc: req.body.desc });

                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `แก้ไขแอปพรีเมี่ยม ${req.body.name}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: 'แก้ไขแอปพรีเมี่ยมสำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})


// ดึงรายการผู้ใช้
app.get('/backoffice/users', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        db_users.find()
                                            .select('-password')
                                            .exec((error, result) => {
                                                res.status(200).json(result)
                                            });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด (Token)' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// แก้ไขผู้ใช้
app.post('/backoffice/users', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        function randomIntFromInterval(min, max) { // min and max included 
                                            return Math.floor(Math.random() * (max - min + 1) + min)
                                        }

                                        const rndInt = randomIntFromInterval(10000000, 99999999)
                                        const us = await db_users.findOne({ _id: req.body.ID })
                                        const password_new = await pwd.generate(String(rndInt))
                                        await db_users.findOneAndUpdate({ _id: req.body.ID }, {
                                            password: password_new
                                        });
                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `แก้ไขรหัสผ่านบัญชีผู้ใช้ ${us.firstname} ${us.lastname}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: `แก้ไขรหัสผ่านบัญชีผู้ใช้สำเร็จ\nคัดลอกรหัสผ่านแล้ว`, password: rndInt })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

// เปลี่ยนรหัสผู้ใช้
app.put('/backoffice/users', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        const uss = await db_users.findOne({ _id: req.body.ID })
                                        await db_users.findOneAndUpdate({ _id: req.body.ID }, {
                                            credit: req.body.Credit,
                                            permission: req.body.Permission,
                                        });
                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `แก้ไขบัญชีผู้ใช้ ${uss.firstname} ${uss.lastname} เครดิต: ${req.body.Credit} ระดับ: ${req.body.Permission == 0 ? 'ผู้ใช้' : req.body.Permission == 0 ? 'แอดมิน' : req.body.Permission == 2 && 'เจ้าของ'}`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: 'แก้ไขบัญชีผู้ใช้สำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})


// ตั้งค่าเว็บไซต์
app.put('/backoffice/setting', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        const { Title, Desc, Domain, Logo, Fav, Keyword, Contact, Like } = req.body

                                        await db_setting.findOneAndUpdate({}, {
                                            title: Title,
                                            desc: Desc,
                                            domain: Domain,
                                            logo: Logo,
                                            fav: Fav,
                                            keyword: Keyword,
                                            contact: Contact,
                                            like: Like,
                                        });

                                        await db_logs.collection.insertOne({
                                            user: String(result._id),
                                            desc: `ตั้งค่าเว็บไซต์`,
                                            type: 'admin',
                                            time: now,
                                        });
                                        res.status(200).json({ msg: 'ตั้งค่าเว็บไซต์สำเร็จ' })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})

app.get('/backoffice/history', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        const u = await db_users.find()
                                        const termgame = await db_gtopup_log.find()
                                        const app = await db_product_log.find()
                                        const order = await db_order.find()
                                        const logs_users = await db_logs.find({ type: 'user' })
                                        const logs_admin = await db_logs.find({ type: 'admin' })
                                        const game = await db_gtopup.find()
                                        const ap = await db_product.find()
                                        const pum = await db_pum_order.find()

                                        const data_pum = await Promise.all(pum.map(async (d, i) => {
                                            const uu = await u.filter((i) => i._id == d.user)
                                            const ress = await axios.post(process.env.PUMLF_API, {
                                                key: setting.key[0].pumlf,
                                                action: 'status',
                                                order: d.order
                                            }, {
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                }
                                            })
                                            if (ress.status == 200) return { user: uu[0].email, id: d?._id, name: d?.name, link: d?.link, order: d?.order, charge: d?.charge, start_count: ress.data.start_count, status: ress.data.status, remains: ress.data.remains, currency: ress.data.currency }
                                        }))
                                        const TG = await Promise.all(termgame.map(async (d) => {
                                            const uu = await u.filter((i) => i._id == d.user)
                                            const data = game.filter(p => p.company_id === String(d.company_id));
                                            d['user'] = uu[0].email
                                            d.company_id = data[0].company_name
                                            return d
                                        }))
                                        const APP = await Promise.all(app.map(async (d) => {
                                            const uu = await u.filter((i) => i._id == d.user)
                                            const data = ap.filter(p => p.id === String(d.id));
                                            d['user'] = uu[0].email
                                            d['id'] = data[0].name
                                            return d
                                        }))
                                        const ORDER = await Promise.all(order.map(async (d) => {
                                            const uu = await u.filter((i) => i._id == d.user)
                                            d['user'] = uu[0].email
                                            return d
                                        }))
                                        const LA = await Promise.all(logs_admin.map(async (d) => {
                                            const uu = await u.filter((i) => i._id == d.user)
                                            d['user'] = uu[0]?.email
                                            return d
                                        }))
                                        const LU = await Promise.all(logs_users.map(async (d) => {
                                            const uu = await u.filter((i) => i._id == d.user)
                                            d['user'] = uu[0]?.email
                                            return d
                                        }))
                                        res.status(200).json({
                                            termgame: TG.reverse(),
                                            app: APP.reverse(),
                                            order: ORDER.reverse(),
                                            logs_users: LU.reverse(),
                                            logs_admin: LA.reverse(),
                                            pum: data_pum.reverse()
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})
app.get('/backoffice/money', async (req, res) => {
    var now = await datetime.now()
    try {
        var token = req.headers.authorization;
        const setting = await db_setting.findOne()
        if (!isEmpty(token)) {
            db_users.findOne({ jwt_token: token }, (error, result) => {
                if (error) {
                    res.status(500).json({ msg: error });
                } else {
                    if (!result) {
                        res.status(500).json({ msg: "มีการเข้าสู่ระบบจากที่อื่น" })
                    } else {
                        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
                            if (err) {
                                res.status(500).json({ msg: 'เซสชั่นหมดอายุแล้ว' })
                            } else {
                                if (result === null) {
                                    res.status(500).json({ msg: 'มีการเข้าสู่ระบบจากที่อื่น' })
                                } else {
                                    if (result.permission == 0) {
                                        res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
                                    } else {
                                        const app = await axios.post('https://byshop.me/api/money', { keyapi: setting.key[0].byshop }, {
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                            }
                                        })
                                        const termgame = await axios.post('https://api.ru6su6.cloud/api/wepay', { key: setting.key[0].termgame, action: 'balance_inquiry' }, {
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                            }
                                        })
                                        const pum = await axios.post(process.env.PUMLF_API, { key: setting.key[0].pumlf, action: 'balance' }, {
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                            }
                                        })
                                        res.status(200).json({ app: { money: app.data.money || 0 }, termgame: { money: termgame.data.money || 0 }, pum: { money: pum.data.balance || 0 } })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ msg: 'เกิดข้อผิดพลาด' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: e })
    }
})




async function redeemvouchers(phone_number, voucher_code) {
    voucher_code = voucher_code.replace(
        "https://gift.truemoney.com/campaign/?v=",
        ""
    );
    let res;
    if (!/^[a-z0-9]*$/i.test(voucher_code)) {
        res = {
            status: "FAIL",
            reason: "Vouncher only allow English alphabets or numbers.",
        };
        return res;
    }
    if (voucher_code.length <= 0) {
        res = {
            status: "FAIL",
            reason: "Vouncher code cannot be empty.",
        };
        return res;
    }
    const data = {
        mobile: phone_number,
        voucher_hash: voucher_code,
    };
    const response = await axios(
        `https://gift.truemoney.com/campaign/vouchers/${voucher_code}/redeem`,
        {
            method: "post",
            data: JSON.stringify(data),
            headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0" },
        }
    ).catch((err) => {
        console.log(err)
        return err;
    });
    const resjson = response.data ? response.data : response.response.data;
    if (resjson.status.code == "SUCCESS") {
        res = {
            status: "SUCCESS",
            amount: parseInt(resjson.data.voucher.redeemed_amount_baht),
        };
        return res;
    } else {
        res = {
            status: "FAIL",
            reason: resjson.status.message,
        };
        return res;
    }
}

app.get("/", (req, res) => {
    res.send("Express on Vercel");
});

app.listen(8000, (req, res) => {
    console.log('>>>>>>>>>> Server Start <<<<<<<<<<')
    console.log('>>>>>>>>>>> Port 8000 <<<<<<<<<<<')
})
module.exports = app;