const mongoose = require("mongoose");
require("./dishes-model");

const dbURL = process.env.DB_URL+process.env.DB_NAME
mongoose.connect(dbURL);

mongoose.connection.on("connected", function(){
    console.log("mongoose connected to", dbURL);
})
mongoose.connection.on("disconnected", function(){
    console.log("mongoose disconnected ", dbURL);
})
mongoose.connection.on("error", function(err){
    console.log("mongoose connection error", err);
})


// "SINGTERM"
process.on("SIGINT", function(){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected by application termination");
        process.exit(0);
    })
})
process.on("SIGUSR2", function(){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected by application restart");
        process.kill(process.pid, "SIGUSR2")
    });
});