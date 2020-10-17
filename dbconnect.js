const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:<${process.env.DB_PASSWORD}>@herd-it-here-first.23sgz.azure.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("Connected to database"))
    .catch(err => {
        console.log(err);
    });

const User = new Schema({
    name: String,
    username: String,
    telegram_id: Number,
    date: Date
});

User.index({
    name: "text",
    username: "text",
    telegram_id: "text"
});

let UserModel = mongoose.model("User", User);