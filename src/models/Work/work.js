    const mongoose = require("mongoose");

    const work = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    front_end: {
        type: String,
        default : ""
    },
    back_end: {
        type: String,
        default : ""
    },
    web: {
        type: String,
        default : ""
    },
    ios: {
        type: String,
        default : ""
    },
    android: {
        type: String,
        default : ""
    },
    type: {
        type: String,
        enum: ['Work', 'Collaborations']
    },
    images: [{
        type: String,
        required: true
    }],
    created_at: {
        type: Date,
        default: new Date()
    }
    });

    const Work = mongoose.model("work", work);

    module.exports = Work;
