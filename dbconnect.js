const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:<${process.env.DB_PASSWORD}>@herd-it-here-first.23sgz.azure.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("Connected to database"))
    .catch(err => {
        console.log(err);
    });

const Bness = new Schema({
    companyname: String,
    industry: String,
    username: String,
    password: String,
    catalog: [String],
    startdate: Date,
});

Bness.index({
    companyname: "text",
    industry: "text",
    username: "text",
    password: "text",
    catalog: "text", //not sure if correct
    startdate: "text",
});

let BModel = mongoose.model("Business", Bness);


function addBness(companyname, industry, username, password, catalog) {
    BModel.find({
        username: username
    }, (err, res) => {
        console.log(res);
        if (res.length != 0) {
            return false;
        } else {
            let user = new BModel({
                companyname,
                industry,
                username,
                password,
                catalog,
                startdate: new Date(),
            });
            console.log(`New user created: ${companyname}!`);
            user.save();
        }
    });
}

function removeBness(companyname, username, password) {
    BModel.findOneAndDelete({
        companyname, //same as companyname: companyname
        username,
        password,
    }, (err, res) => {
        if (err) {
            console.log(err); //err is the actual error
            return false;
        } else {
            if (res) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function getBness() {
    BModel.find({
        companyname
    }, (err, res) => {
        //console.log(res);
        if (res.length != 0) {
            return true;
        } else {
            console.log("business not found")
            return false;
        }
    });
}