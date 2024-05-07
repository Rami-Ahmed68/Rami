const express = require("express");
const router = express.Router();
const Joi = require("joi");

const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const Work = require("../../models/Work/work");
const upload = require("../../utils/uploadeMulter");
const CloudinaryUploade = require("../../utils/uploadCloud");
const VerifyToken = require("../../utils/verifyToken");
const DeleteFiles = require("../../utils/deleteImages");
const CloudinaryRemove = require("../../utils/deleteCloudinary");

router.put("/" , upload , async (req , res , next) => {
    try {

        // create a Schema to validate body data using it
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            workId : Joi.string().required(),
            title : Joi.string(),
            description : Joi.string(),
            front_end : Joi.string(),
            back_end : Joi.string(),
            web : Joi.string(),
            ios : Joi.string(),
            android : Joi.string(),
            type : Joi.string(),
            images : Joi.string()
        });

        // validate body data using Schema
        const Error = Schema.validate(req.body);

        // check if the body data has any problem
        if (Error.error) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors(Error.error , 400));
        }

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if the id in token is equal admin id or not
        if (VerifyTokenData && VerifyTokenData._id != req.body.adminId) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Admin Data .." , 403))
        }

        // find the admin
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // find the work
        const work = await Work.findById(req.body.workId);

        // check if the work is exists
        if (!work) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Work Not Found ..." , 404));
        }

        // find and update work
        const up = await Work.findByIdAndUpdate({ _id : req.body.workId } , {
            $set : {
                title : req.body.title ? req.body.title : work.title,
                description : req.body.description ? req.body.description : work.description,
                front_end : req.body.front_end ? req.body.front_end : work.front_end,
                back_end : req.body.back_end ? req.body.back_end : work.back_end,
                web : req.body.web ? req.body.web : work.web,
                ios : req.body.ios ? req.body.ios : work.ios,
                android : req.body.android ? req.body.android : work.android,
                type : req.body.type ? req.body.type : work.type
            }
        } , { new : true });

        if (req.files.length > 0) {
            // delete all old images from cloudinary
            for(let i = 0; i < work.images.length; i++) {
                await CloudinaryRemove(work.images[i])
            }

            // emptying images's array
            up.images = [];

            for(let i = 0; i < req.files.length; i++) {
                // uploade the new image to cloudinary
                const uploadedImage = await CloudinaryUploade(req.files[i]);

                // add the uploaded image url to the 
                up.images.push(uploadedImage);
            }
        }

        // save the work after updated
        await up.save();

        // delete images
        DeleteFiles(req.files , next);

        // create result 
        const result = {
            "message" : "Work Updated Successully",
            "Work" : up
        }

        // send the result to the user
        res.status(200).send(result);

    } catch (error) {
        DeleteFiles(req.files , next);
        return next(new ApiErrors(error , 500));
    }
});

module.exports = router;