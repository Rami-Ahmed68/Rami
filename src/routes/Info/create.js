const  express = require('express');
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");

const Info = require("../../models/Info/info");
const Admin = require("../../models/Admin/admin");

const ApiErrors = require("../../utils/apiError");
const VerifyToken = require("../../utils/verifyToken");

router.post("/" , async(req , res , next) => {
    try {

        // create a Schema to validate body data using it
        const Schema = Joi.object().keys({
            adminId : Joi.string().required(),
            love : Joi.string().required(),
            work : Joi.string().required(),
            bio : Joi.string().required()
        });

        // validate body data
        const Error = Schema.validate(req.body);

        // check if the body  data has any problem 
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }

        // verify token data
        const VerifyTokenData = await VerifyToken(req.headers.authorization , next);

        // check if the id in request is equal the id in token or not
        if (VerifyTokenData._id != req.body.adminId) {
            return next(new ApiErrors("Invalid Admin Data ..." , 403))
        }

        // find the admin
        const admin = await Admin.findById(req.body.adminId);

        // check if the admin is exists
        if (!admin) {
            return next(new ApiErrors("Invalid Admin Not Found ..." , 404));
        }

        // create a Info
        const info = new Info({
            work : req.body.work,
            bio : req.body.bio,
            love : req.body.love
        });

        // save the info in database 
        await info.save();

        // create result 
        const result = {
            "message" : "Info created Successfully",
            "Info" : info
        }

        // send the result to the user
        res.status(200).send (result);

    } catch (error) {
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;