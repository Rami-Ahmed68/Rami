const express = require("express");
const router = express.Router();
const Joi = require("joi");

const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const Work = require("../../models/Work/work");
const VerifyToken = require("../../utils/verifyToken");
const CloudinaryRemove = require("../../utils/deleteCloudinary");

router.delete("/" , async (req , res , next) => {
    try {

        // create schema to validate body data 
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            workId : Joi.string().required()
        });

        // validate body data using Schem 
        const Error = Schema.validate(req.body);

        // check if the body has any problem
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }

        // find the admin
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if the id in token is equal admin id in body
        if (VerifyTokenData._id != req.body.adminId) {
            return next(new ApiErrors("Invalid Admin Data ..." , 404));
        }

        // find the work 
        const work = await Work.findById(req.body.workId);

        // check if the work is exists
        if (!work) {
            return next(new ApiErrors("Invalid Work Not Found ..." , 404));
        }

        // delete all work images
        if (work.images.length > 0) {
            for(let i = 0; i < work.images.length; i++) {
                await CloudinaryRemove(work.images[i]);
            }
        }

        // find and delete the work
        await Work.findByIdAndDelete(req.body.workId);

        // create result
        const result = {
            "message" : "Work Delete Successfully",
        };

        // send the result to user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500));
    }
});

module.exports = router;
