const mongoose = require("mongoose");

const skill = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    icon : {
        type : String
    }
});

const Skill = mongoose.model("Skill" , skill);

module.exports = Skill;