const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path : "./config/.env" });
const cors = require("cors");

// create a cors opetion
const corsOptions = {
    origin : "*",
    mrthods : "GET , POST , PUT , DELETE"
};

// use the cors options
app.use(cors(corsOptions));


const Global = require("./src/middleware/globalError");
const ApiErrors = require("./src/utils/apiError");

// require Admin files
const CraeteAdmin = require('./src/routes/Admin/create');
const UpdateAdmin = require('./src/routes/Admin/update');
const LoginAdmin = require("./src/routes/Admin/login");
// require Admin files

// require Info files
const CreateInfo = require("./src/routes/Info/create");
const UpdateInfo = require("./src/routes/Info/update");
const GetInfo = require("./src/routes/Info/get");
// require Info files

// require Work files
const CreateWork = require("./src/routes/Work/create");
const GetWorks = require("./src/routes/Work/get");
const UpdateWork = require("./src/routes/Work/update");
const DeleteWork = require("./src/routes/Work/delete");
const GetWork = require("./src/routes/Work/getWork");
// require Work files

// require Skill files
const CreateSkill = require("./src/routes/Skills/create");
const GetSkills = require("./src/routes/Skills/get");
const UpdateSkill = require("./src/routes/Skills/update");
const DeleteSkill = require("./src/routes/Skills/delete");
// require Skill files

app.use(express.json());

// create a admin api's
app.use("/admin/add" , CraeteAdmin);
app.use("/admin/up" , UpdateAdmin);
app.use("/admin/login" , LoginAdmin);
// create a admin api's

// create a Info api's
app.use("/info/create" , CreateInfo);
app.use("/info/up" , UpdateInfo);
app.use("/info/get" , GetInfo);
// create a Info api's

// create a Work api's
app.use("/work/create" , CreateWork);
app.use("/work/get" , GetWorks);
app.use("/work/up" , UpdateWork);
app.use("/work/delete" , DeleteWork);
app.use("/work/getone" , GetWork)
// create a Work api's

// create a Skill api's
app.use("/skill/create" , CreateSkill);
app.use("/skill/get" , GetSkills);
app.use("/skill/up" , UpdateSkill);
app.use("/skill/delete" , DeleteSkill);
// create a Skill api's

// send the use to the index.html page in front end section to handling the ( router )
app.get('*', (req, res) => {
    res.redirect('https://rami-web.onrender.com/');
});

// handling api's
app.all("*" , (req , res , next) => {
    return next(new ApiErrors("Api Not Found ..." , 404));
});

// Global error handling middlware
app.use(Global);


// connection to database
mongoose.connect(process.env.DATA_BASE_i)
.then(() => {
    console.log("####### Conected #######")
}).catch((error) => {
    console.log(error);
});


app.listen(process.env.PORT , () => {
    console.log(`Server Working On Port ${process.env.PORT}`);
})
