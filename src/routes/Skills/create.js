const express = require("express");
const router = express.Router();
const Joi = require("joi");

const ApiErrors = require('../../utils/apiError');
const VerifyToken = require("../../utils/verifyToken");
// const 
const Admin = require("../../models/Admin/admin");
const Skill = require("../../models/Skills/skil");
const upload = require("../../utils/uploadeMulter");
const DeleteFiles = require("../../utils/deleteImages");
const CloudinaryUploade = require("../../utils/uploadCloud");


router.post("/" , upload , async (req , res , next) => {

    try {
        // create a Schem 
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            title : Joi.string().required(),
            images : Joi.string()
        });

        // validate body data
        const Error = Schema.validate(req.body);

        // check if the body data has any problem
        if (Error.error) {
            DeleteFiles(req.files , next)
            return next(new ApiErrors(Error.error , 400));
        }

        // check if the admin sended more than one icon
        if (req.files.length > 1) {
            DeleteFiles(req.files , next);
            return next(new ApiErrors("You can upload one icon just ..." , 403))
        } 

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if the id i token is equl the id in body data
        if (VerifyTokenData && VerifyTokenData._id != req.body.adminId) {
            DeleteFiles(req.files , next)
            return next(new ApiErrors("Invalid Admin Data ..." , 403))
        };

        // find the admin 
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            DeleteFiles(req.files , next)
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // create a skill
        const skill = new Skill({
            title : req.body.title,
            icon : ""
        });

        // uploade the icon to the cloudinary
        const uploadedIcon = await CloudinaryUploade(req.files[0]);

        // add the icon url to the skill
        skill.icon = uploadedIcon;

        // delete images from images folder
        DeleteFiles(req.files , next)

        // save the skill 
        await skill.save();

        // create a result
        const result = {
            "message" : "Skill Created Successfully",
            "skill" : skill 
        }

        // send the result to the user
        res.status(200).send(result);

    } catch (error) {
        DeleteFiles(req.files , next)
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;
