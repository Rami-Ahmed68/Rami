const jwt = require("jsonwebtoken");

const GenerateToken = function(id , email) {
    const token = jwt.sign({
        _id : id,
        email : email
    } , process.env.JWT_PUBLIC_KEY)
    return token;
}

module.exports = GenerateToken;