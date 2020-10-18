const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:<${process.env.DB_PASSWORD}>@herd-it-here-first.23sgz.azure.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("Connected to database"))
    .catch(err => {
        console.log(err);
    });

const BnessSchema = new Schema({
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

let BModel = mongoose.model("Business", BnessSchema);


function addBness(companyname, industry, username, password, catalog) {
    BModel.find({
        username: username
    }, (err, res) => {
        console.log(res);
        if (res.length != 0) {
            return false;
        } else {
            let newuser = new BModel({
                companyname,
                industry,
                username,
                password,
                catalog,
                startdate: new Date(),
            });
            console.log(`New user created: ${companyname}!`);
            newuser.save();
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

function getBness(companyname) {
    BModel.find({
        companyname
    }, (err, res) => {
        //console.log(res);
        if (res.length != 0) {
            return res; //how do I return bness object found?
        } else {
            console.log("business not found")
            return false;
        }
    });
}

const ProductSchema = new Schema({
    productname: String,
    url: Srting
});
const CatalogSchema = new Schema({
    products: [ProductSchema] //products is an array of ProductSchema objects
});

let CModel = mongoose.model("Catalog", CatalogSchema);
let PModel = mongoose.model("Products", ProductSchema);

function getProduct(productname) {
    CModel.find({
        productname,
    }, (err, res) => {
        if (res.length != 0) {
            return res; //how do I return product object found?
        } else {
            console.log("product not found")
            return false;
        }
    });
}

function addProduct(companyname, productname, url) {
    BModel.find({
        companyname
    }, (err, res) => {
        //console.log(res);
        if (res.length != 0) {
            //company found
            let newproduct = new PModel({
                productname,
                url,
            });
            //TODO: put newproduct into catalog beloging to companyname
        } else {
            //company not found
            console.log("company not found")
            return false;

        }
        console.log(`New product created: ${productname}!`);
        newproduct.save();
    });
}