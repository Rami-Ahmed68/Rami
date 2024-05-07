const bcrypt = require("bcrypt");

const ComparePassword = async function (pass1 , pass2) {
    return await bcrypt.compare(pass1 , pass2);
};

module.exports = ComparePassword;