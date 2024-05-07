const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path : "../../config/.env" });

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
});


const CloudinaryRemove = async function (image) {
    try {
        // extrac the image publick id
        const imageData = image.split("/");

        // extract the public id from imageData
        const publicId = imageData[imageData.length - 1].split(".")[0];

        const data = await cloudinary.uploader.destroy(publicId);

        return data;
    } catch (error) {
        return error
    }
};

module.exports = CloudinaryRemove;