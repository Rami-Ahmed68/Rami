const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ =require("lodash");

const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const ComparePassword = require("../../utils/comparePassword");
const GenerateToken = require("../../utils/generatToken");

router.post("/" , async ( req , res , next ) => {

    try {

        // craete a Schema to validate body data using it
        const Schema = Joi.object().keys({
            email : Joi.string().required(),
            password : Joi.string().required()
        });

        // validate body data using Schema
        const Error = Schema.validate(req.body);

        // check if the body data has any problem
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }

        // find the admin by his email
        const admin = await Admin.findOne({ email : req.body.email });

        // check if the admin is exists or not
        if (!admin) {
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // compare passwords
        const PasswordStatus = await ComparePassword(req.body.password , admin.password);

        // check if the PasswordStatus is false
        if (!PasswordStatus) {
            return next(new ApiErrors("Invalid Email Or Password ..." , 400));
        }

        // generate token
        const token = GenerateToken(admin._id , admin.email);

        // create result
        const result = {
            "admin" : _.pick(admin , ['_id' , 'name' , 'email']),
            "token" : token
        }

        // send the admin data to user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;