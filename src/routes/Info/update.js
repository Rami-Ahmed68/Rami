const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");


const Admin = require("../../models/Admin/admin");
const Info = require("../../models/Info/info");

const ApiErrors = require('../../utils/apiError');
const VerifyToken = require("../../utils/verifyToken");

router.put("/" , async (req , res , next) => {

    try {
        
        // craete a Schema to valiadte body data suing it
        const Schema = Joi.object().keys({
            infoId : Joi.string().required(),
            adminId : Joi.string().required(),
            work : Joi.string(),
            bio : Joi.array(),
            love : Joi.string()
        });

        // validate body data
        const Error = Schema.validate(req.body);

        // check if the body data has any problem
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        };

        // find the admin 
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // verify admin data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if admin id in body is equal the id in token
        if ( VerifyTokenData && VerifyTokenData._id != req.body.adminId) {
            return next(new ApiErrors("Invalid Admin Data ..." , 404));
        }

        // find the Info object
        const info = await Info.findById(req.body.infoId);

        // check if the info is exists or not 
        if (!info) {
            return next(new ApiErrors("invalid info Not Found ..." , 404));
        }

        let treu = { new: true };

        // find and update info
        const up = await Info.findByIdAndUpdate({ _id: req.body.infoId } , {
            $set : {
                work : req.body.work ? req.body.work : info.work,
                bio : req.body.bio ? req.body.bio : info.bio,
                love : req.body.love ? req.body.love : info.love
            }
        } , treu);

        // create result 
        const result = {
            "message" : "Info updated successfully",
            "Info" : up
        }

        // send the result to  the user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500));
    }
});

module.exports = router;