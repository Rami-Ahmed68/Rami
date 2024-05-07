const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");

const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const Hashing = require("../../utils/hashingPassword");

router.put("/" , async (req , res , next) => {

    try {

        // create a Schema to validate body data using it
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            name : Joi.string(),
            email : Joi.string().email(),
            password : Joi.string()
        });

        // validate body data using Schema
        const Error = Schema.validate(req.body);

        // check if the body has any problem
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }

        // check if the body has data or not
        if (!req.body.name && !req.body.password) {
            return next(new ApiErrors("You must send name or password to update it ..." , 403));
        }

        // find the admin
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // update admin 
        const up = await Admin.findByIdAndUpdate({ _id : req.body.adminId } , {
            $set : {
                name : req.body.name ? req.body.name : admin.name,
                password : req.body.password ? await Hashing(10 , req.body.password) : admin.password,
            }
        } , { new : true });

        // create a result
        const result = {
            "message" : "Admin data updated successfully",
            "admin" : _.pick(up , ['_id' , 'name' , 'email'])
        }

        // send the result to user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;