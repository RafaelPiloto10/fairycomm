const db = require("./db")

//  api.registerBusiness(username, password, business, email, address, city, zip, phone);
async function registerBusiness(db, username, password, business, email, address, city, zip, phone){
    let results = await db.addBness(username, password, business, email, address, city, zip, phone)
    console.log(results);
    return results;
}

async function authenticateUser(db, username, password) {
    return new Promise( async (resolve, reject) => {
        let results = await db.getBness(username, password);
        resolve(results);
    })
}

module.exports = {
    registerBusiness,
    authenticateUser
}