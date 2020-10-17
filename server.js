const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public/'));

const route = app.listen(PORT, () => {
    console.log("Server is up and running at: http://localhost:3000");
})