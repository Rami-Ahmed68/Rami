const express = require("express");
const router = express.Router();
const Joi = require("joi");

const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const Skill = require("../../models/Skills/skil");
const DeleteFiles = require("../../utils/deleteImages");
const upload = require("../../utils/uploadeMulter");
const VerifyToken = require("../../utils/verifyToken");
const CloudinaryUploade = require("../../utils/uploadCloud");
const CloudinaryRemove = require("../../utils/deleteCloudinary");

router.put("/" , upload , async (req , res , next) => {

    try {

        // craete a Schema to valiadte body data using it
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            skillId : Joi.string().required(),
            title : Joi.string()
        });

        // validate body data
        const Error = Schema.validate(req.body);

        // check if the body data has any problem
        if (Error.error) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors(Error.error , 400));
        }

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if the id in token is equl the id in body 
        if (VerifyTokenData && VerifyTokenData._id != req.body.adminId) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Admin Data ..." , 404));
        }

        // find the admin 
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // find the skill
        const skill = await Skill.findById(req.body.skillId);

        // check if the skill is eixsts
        if (!skill) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("Invalid Skill Not Found ..." , 404))
        }

        // update the skill
        const up = await Skill.findByIdAndUpdate({ _id : req.body.skillId } ,{
            $set : {
                title : req.body.title ? req.body.title : skill.title
            }
        } , { new : true });

        
        if (req.files.length > 0) {
            // delete old icon from cloudinary 
            await CloudinaryRemove(skill.icon);

            // upload the icon to the cloudinary 
            const uploadedIcon = await CloudinaryUploade(req.files[0]);

            // update skill icon
            up.icon = uploadedIcon;
        }

        // save the upafter updated
        await up.save();

        // delete image from images folder
        DeleteFiles(req.files , next);

        // create resut 
        const result = {
            "message" : "Skill Updated Successfully",
            "skill" : up
        }

        // send the result to user
        res.status(200).send(result)

    } catch (error) {
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;