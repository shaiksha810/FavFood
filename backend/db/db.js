const mongoose = require('mongoose');


const dbConnection = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Atlas is connected");
    }).catch((err) => {
        console.log(err);
    })
}


module.exports = dbConnection;