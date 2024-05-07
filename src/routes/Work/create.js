const  express = require('express');
const router = express.Router();

const Joi = require("joi");
const _ = require('lodash');
const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const Work = require("../../models/Work/work");
const VerifyToken = require("../../utils/verifyToken");

const upload = require("../../utils/uploadeMulter");
const cloudinaryUploading = require("../../utils/uploadCloud");
const DeleteFiles = require("../../utils/deleteImages");


router.post("/" , upload , async (req , res , next) => {
    
    try {

        // craete Schema to validate body data using it
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            title : Joi.string().required(),
            description : Joi.string().required(),
            front_end : Joi.string(),
            back_end : Joi.string(),
            web : Joi.string(),
            ios : Joi.string(),
            android : Joi.string(),
            type : Joi.string().required(),
            images : Joi.string()
        });

        // validate body data using Schema
        const Error = Schema.validate(req.body);
        
        //check if the body dta has any problem
        if (Error.error) {
            // delete all req files
            DeleteFiles(req.files , next);
            return next(new ApiErrors(Error.error , 400));
        }

        // check if the request ahs any image
        if (req.files.length == 0) {
            return next(new ApiErrors("Images Is Required ..." , 403));
        }

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization);

        // check if the id in body is equla the id in token
        if (VerifyTokenData && VerifyTokenData._id != req.body.adminId) {
            // delete all req files
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Admin Data ..." , 403));
        }

        // find the admin 
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists 
        if (!admin) {
            // delete all req files
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // create a work object
        const work = new Work({
            title : req.body.title,
            description : req.body.description,
            front_end : req.body.front_end,
            back_end : req.body.back_end,
            web : req.body.web,
            ios : req.body.ios,
            android : req.body.android,
            type : req.body.type,
            images : []
        });

        // add all uploaded images url's to the work's images array
        for(let i = 0; i < req.files.length; i++) {
            // send image to the cloudinaryUploading file to upload it
            const uploadedImage = await cloudinaryUploading(req.files[i]);

            // add the uploadedImage url to images array
            work.images.push(uploadedImage);
        }

        // save the work object in data base
        await work.save();

        // delete all req files
        DeleteFiles(req.files , next);

        // create result 
        const result = {
            "message" : "Work Created Successfully",
            "work" : work
        }

        // send the resultto the user
        res.status(200).send(result);

    } catch (error) {
        DeleteFiles(req.files , next);
        return next(new ApiErrors(error , 500));
    }
})


module.exports = router;