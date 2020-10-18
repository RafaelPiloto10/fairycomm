require('dotenv').config();
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@herd-it-here-first.23sgz.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri2 = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ijjzb.azure.mongodb.net/${process.env.DB_NAME}>?retryWrites=true&w=majority`
const Schema = mongoose.Schema;
mongoose.connect(uri2, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("Connected to database"))
    .catch(err => {
        console.log(err);
    });


const BnessSchema = new Schema({
    companyname: String,
    username: String,
    password: String,
    email: String,
    address: String,
    city: String,
    zip: String,
    phone: String,
    catalog: [Schema.Types.Mixed],
    startdate: Date,
});

let BModel = mongoose.model("Business", BnessSchema);



//  api.registerBusiness(username, password, business, email, address, city, zip, phone);
function addBness(username, password, companyname, email, address, city, zip, phone) {
    return new Promise((resolve, reject) => {
        BModel.find({
            username: username
        }, (err, res) => {
            if (err) {
                console.log("ERROR:" + err);
                return false;
            } else {
                let catalog = [];
                let newuser = new BModel({
                    companyname,
                    username,
                    password,
                    email, address,
                    city,
                    zip,
                    phone, 
                    catalog,
                    startdate: new Date(),
                });
                console.log(`New user created: ${companyname}!`);
                newuser.save();
                resolve(true);
            }
        });
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
function getBness(username, password) {
    return new Promise((resolve, reject) => {
        BModel.findOne({
            username,
            password
        }, (err, res) => {
            console.log(res);
            if(err){
                resolve(null);
            }
            if(res != undefined){
                resolve(res);
            }
            else{
                resolve(null);
            } 
        });
    });
}


function getBnessByName(companyname) {
    BModel.find({
        companyname
    }, (err, res) => {
        //console.log(res);
        if (res.length != 0) {
            return res; 
        } else {
            console.log("business not found")
            return false;
        }
    });
}

function getCatalog(companyname) {
    BModel.find({
        companyname,
    }, (err, res) => {
        if (res.length != 0) {
            return res.catalog; //how do I return product object found?
        } else {
            console.log("product not found")
            return false;
        }
    });
}

function addProduct(companyname, product) {
    BModel.findOne({
        companyname,
        username
    }, (err, res) => {
        //console.log(res);
        if (res.length != 0) {
            //company found
            BModel.updateOne({
                companyname,
                username
            }, {
                catalog: res.catalog + [product]
            }, (err2, res2) => {
                if (err2 != null) {
                    console.log(err2);
                } else {
                    console.log(`Successfully added product for ${companyname}!`);
                }
            });
        } else {
            //company not found
            console.log("company not found")
            return false;

        }
        console.log(`New product created: ${productname}!`);
        newproduct.save();
    });
}

module.exports = {
    addBness,
    getBness,
    removeBness,
    addProduct,
    getCatalog,
    // removefProduct - Need to implement
}