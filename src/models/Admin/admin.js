
const mongoose = require("mongoose");

const admin = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const Admin = mongoose.model("admin" , admin);
module.exports = Admin;