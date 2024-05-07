const jwt = require("jsonwebtoken");
const ApiErrors = require("./apiError");
const dotenv = require("dotenv");
dotenv.config({ path : "../../config/.env" });

const VerifyToken = async (header , next) => {
    // catch the header
    const authHeader = header;

    //check if the authHeader is exists and start with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(new ApiErrors("Invalid Authorization HEader Format ..." , 400))
    }

    // extract the token from authHeader
    const token = authHeader.split(" ")[1];

    // check if the token is exists or not
    if (!token) {
        return next(new ApiErrors("Token IS Required ..." , 403));
    }

    // extract the data from token
    const Data = jwt.verify(token , process.env.JWT_PUBLIC_KEY);

    // return the data 
    return Data;
};

module.exports = VerifyToken;