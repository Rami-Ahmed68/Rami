const express = require("express");
const router = express.Router();


const ApiErrors = require("../../utils/apiError");
const Skill = require("../../models/Skills/skil");

router.get("/" , async (req , res , next) => {
    try {

        // get all skills
        const skills = await Skill.find();

        // create a result
        const result = {
            "message" : `${skills.length} Skills`,
            "skills" : skills
        }

        //send the result to user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(error , 500))
    }
});

module.exports = router;