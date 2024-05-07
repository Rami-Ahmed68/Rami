const express = require("express");
const router = express.Router();

const Work = require("../../models/Work/work");
const ApiErrors = require("../../utils/apiError");

router.get("/" , async (req , res , next) => {

    try {

        // gett the works 
        const works = await Work.find();

        // create result
        const result = {
            "message" : `You have ${works.length} of works`,
            "works" : works
        }

        // sen dthe result to user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500));
    }
});

module.exports = router;