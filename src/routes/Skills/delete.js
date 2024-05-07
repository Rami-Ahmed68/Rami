const express = require("express");
const router = express.Router();
const Joi = require("joi");

const ApiErrors = require("../../utils/apiError");
const Admin = require("../../models/Admin/admin");
const Skill = require("../../models/Skills/skil");
const VerifyToken = require("../../utils/verifyToken");
const CloudinaryRemove = require("../../utils/deleteCloudinary");

router.delete("/" , async (req , res , next) => {

    try {

        // create a Schema to validate body data using it
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            skillId : Joi.string().required()
        });

        // validate body data
        const Error = Schema.validate(req.body);

        // check if the body has any problem
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }   

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if the id in token is equal id in body
        if (VerifyTokenData && VerifyTokenData._id != req.body.adminId) {
            return next(new ApiErrors("Invalid Admin Data ..." , 403))
        }

        // find the admin 
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            return next(new ApiErrors("Invaldi Admin Not Found ..." , 404));
        }

        // find the skill
        const skill = await Skill.findById(req.body.skillId);

        // check if the skill is exists
        if (!skill) {
            return next(new ApiErrors("Invalid Skill Not Found ..." , 404));
        }

        await CloudinaryRemove(skill.icon)

        // delete skill
        await Skill.deleteOne(skill._id);

        // create result
        const result = {
            "message" : "Skill Deleted Successfully"
        }

        // send the result to user
        res.status(200).send(result)

    } catch (error) {
        return next(new ApiErrors(error , 500));
    }
});

module.exports = router;