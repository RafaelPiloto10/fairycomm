const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USERNAME}:<${process.env.DB_PASSWORD}>@herd-it-here-first.23sgz.azure.mongodb.net/<dbname>?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));