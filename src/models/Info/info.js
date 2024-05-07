const mongoose = require("mongoose");

const info = mongoose.Schema({
    work : {
        type : String,
        required : true
    },
    bio : [{
        type : String,
        required : true
    }],
    love : {
        type : String,
        required : true
    }
});

const Info = mongoose.model("info" , info);

module.exports = Info;

