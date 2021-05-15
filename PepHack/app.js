let express=require("express");
const dotenv=require("dotenv");
dotenv.config({path:"./config.env"});
console.log(process.env.youremail);
let app=express();
const hbs=require("hbs");
let hearth=require("./hackerearth.js");
app.use(express.static('public'));
app.set("view engine","hbs");
app.get("/",async(req,res)=>{
   let html=await  hearth();
    res.render("index",{data:html}); 
})
app.listen(3000,()=>{
    console.log("running on port number 3000");
})
