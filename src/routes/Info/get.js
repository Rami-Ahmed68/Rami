const express = require("express");
const router = express.Router();

const ApiErrors = require("../../utils/apiError");
const Info = require("../../models/Info/info");

router.get("/" , async (req , res , next) => {
    try {
        
        // get the info
        const info = await Info.find();
        
        // crrate result
        const result = {
            "message" : "Info finded Successfully",
            "Info" : info
        }

        // send the result to user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;