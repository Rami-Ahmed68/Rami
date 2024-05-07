const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");

const Admin = require("../../models/Admin/admin");
const ApiErrors = require("../../utils/apiError");
const GenerateToken = require("../../utils/generatToken");
const HashingPassword = require('../../utils/hashingPassword');

router.post("/" , async (req , res , next) => {

    try {

        // create a Schema to validate body data using that
        const Schema = Joi.object().keys({
            name : Joi.string().required(),
            email : Joi.string().email().required(),
            password : Joi.string().required()
        });

        // validate body data usin using Schema
        const Error = Schema.validate(req.body);

        // check if the body data has any problem return error
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }

        // hash password
        const hashedPassword = await HashingPassword(10 , req.body.password);

        // craete a admin
        const admin = new Admin({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        });

        // sav ethe admin in data base
        await admin.save();

        // generate token
        const token = GenerateToken(admin._id , admin.email);

        // create a result
        const result = {
            "admin" : admin,
            "token" : token
        }

        // send the result to the user 
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500));
    }

});

module.exports = router;