let AWS = require('aws-sdk');
const { json } = require('body-parser');
let express = require('express');
let UserRouter = express.Router();
let config = {
    "region": "ap-southeast-1",
    "accessKeyId": "", "secretAccessKey": ""
};
AWS.config.update(config);
let docClient = new AWS.DynamoDB.DocumentClient();
let table = "Users";
const bodyParser = require("body-parser");
UserRouter.use(bodyParser.urlencoded({ extended: true }));
UserRouter.use(bodyParser.json());
UserRouter.use(express.json())
UserRouter.route('/Register').post(function (req, res) {
    const { name, phoneNumber, email, password } = req.body;
    console.log(phoneNumber)
    let param = {
        TableName: table,
        Item: {

            "phoneNumber": phoneNumber,
            "email": email,
            "password": password,
            "active": true,
            "admin": false,
            "name": name
        }
    }
    docClient.put(param, (err, data) => {
        if (err) {
            res.status(400).send(JSON.stringify({ "mes": "sai" }));
        } else {
            res.status(200).send(JSON.stringify({ "mes": "dung" }));
        }
    });
});

UserRouter.route('/list').get((req, res) => {
    let param = {
        TableName: table,
    }
    docClient.scan(param, (err, data) => {
        if (err) {
            res.json({
                "mes: ": err
            })
        } else {

            res.status(200).send(JSON.stringify(data.Items))
            console.log(JSON.stringify(data.Items))
        }
    });
});
UserRouter.route('/login').post((req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    console.log(email)
    console.log(password)
    let param = {
        TableName: table,
        Key: {
            "email": email,
        }

    }
    docClient.get(param, (err, data) => {
        const obj = [];

        try {
            obj.push(data.Item);

            if (obj.length >= 0) {
                if (data.Item.password == req.body.password) {
                    const objToSend = {
                        password: data.Item.password,
                        email: data.Item.email
                    }
                    console.log("ok")
                    res.status(200).send(JSON.stringify(objToSend))
                } else {
                    console.log("ko")
                    res.status(400)
                }


            } else {
                console.log("ccc")
            }
        } catch (error) {
            res.status(400)
        }

    })
});
// UserRouter.route('/register').get((req, res) => {
//     const { email, name, password, phoneNumber, active, admin } = req.body;
//     let param = {
//         TableName: table,
//     }
// });
// Userrouter.route('/edit/:id').get(function (req, res) {
//     let id = req.params.id;
//     Person.findById(id, function (err, t) {
//         res.json(t);
//     });
// });
// Userrouter.route('/update/:id').post(function (req, res) {
//     User.findById(req.params.id, function (err, user) {
//         if (!user)
//             res.status(404).send("data is not found");
//         else {
//             console.log(user);
//             user.name = req.body.name;
//             user.phone = req.body.phone;
//             user.email = req.body.email;
//             user.password = req.body.password;

//             user.save().then(business => {
//                 res.json('Update complete');
//             })
//                 .catch(err => {
//                     res.status(400).send("unable to update the database");
//                 });
//         }
//     });
// });
// Userrouter.route('/delete/:id').get(function (req, res) {
//     User.findByIdAndRemove({ _id: req.params.id }, function (err, user) {
//         if (err) res.json(err);
//         else res.json('Successfully removed');
//     });
// });
// Userrouter.route('/login').post((req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const query = { $and: [{ 'email': email }, { "password": password }] };
//     User.find(query, (err, user) => {
//     })
// });

// Userrouter.get('/allus', (req, res) => {
//     User.find();
// });
// UserRouter.post('/send-email', (req, res) => {
//     var otp = otpGenerator.generate(6, { upperCase: false, alphabets: false, specialChars: false });
//     const maxacthuc = req.body.maxacthuc;  // truyen qua body maxacthuc
//     console.log(req.body.email)
//     var transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true,
//         auth: {
//             user: 'xudubicu@gmail.com',
//             pass: "toilatoi123"
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });
//     var mainOptions = {
//         from: 'phamquoctoan11081999@gmail.com',
//         to: req.body.email,//req.body.email
//         subject: 'GMAIL XAC THUC TAI KHOAN',
//         text: 'Mã xác thực tài khoản của bạn là: ' + otp,
//     }
//     transporter.sendMail(mainOptions, (err, info) => {
//         if (err) {
//             console.log(err);
//             return res.json({ msg: "false" });
//         }
//         else {
//             console.log('Message sent: ' + info.response);
//             return res.json({ msg: otp });
//         }
//     });
// });

//////////////////////tao bang
UserRouter.get('/taobang', (req, res) => {
    var dynamodb = new AWS.DynamoDB();
    var params = {
        TableName: "Users",
        KeySchema: [
            { AttributeName: "email", KeyType: "HASH" },  //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "email", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    dynamodb.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
})










///////////////////////////////
module.exports = UserRouter;