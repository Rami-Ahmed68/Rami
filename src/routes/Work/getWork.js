const express = require("express");
const router = express.Router();
const Joi = require("joi");

const ApiErrors = require("../../utils/apiError");
const Work = require("../../models/Work/work");

router.get("/" , async (req , res , next) => {
    try {

        // create Schema to validate body data
        const Schema = Joi.object().keys({
          workId: Joi.string().required()
        });
        
        // valiadte body data using the Schema
        const Error = Schema.validate(req.query);

        // check if the body data has any problem
        if (Error.error) {
            return next(new ApiErrors(Error.error , 400));
        }

        // find the work
        const work = await Work.findById(req.query.workId);

        // check if the work id exists
        if (!work) {
            return next(new ApiErrors("Invalid Work Not Found ..." , 404));
        }

        // create result
        const result = {
            "message" : "Work finded successfully",
            "work" : work
        }

        // send the result to the user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500))
    } 
});

module.exports = router;
