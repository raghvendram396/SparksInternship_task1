// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// // const ejs = require("ejs");
// const mongoose = require("mongoose");
// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));


const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const { MongoGridFSChunkError } = require("mongodb");
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

 mongoose.connect("mongodb+srv://admin-mishra:test-123@cluster0.jjmbi.mongodb.net/SparksInternship",{useNewUrlParser: true, useUnifiedTopology: true});

const customerSchema=new mongoose.Schema({
    SNo: Number,
    Name: String,
    email: String,
    bankBalance: Number
})
const transactionSchema=new mongoose.Schema({
    sender: String,
    receiver: String,
    moneysent: Number
    
});
var rupee=100000
const customer=mongoose.model("customer",customerSchema);
const transaction=mongoose.model("transaction",transactionSchema);
app.get("/",function(req,res){
    res.render("index");
})
app.get("/allcustomers",function(req,res) {
    customer.find(function(err,data) {
        if(err)
        console.log(err)
        else {
           transaction.find(function(err,transdata){
           if(err)
           console.log(err)
           else   res.render("customers",{listofcustomer:data,myMoney: rupee,trandata: transdata});
           })
          }

    })
})
app.post("/sendmoney",function(req,res){
   const username=req.body.username+"@email.com";
   const money=req.body.money;
   const tran=new transaction({sender: "raghvendra@email.com",receiver: username, moneysent: money});
   tran.save();
   customer.updateOne({email: username},{ $inc: {bankBalance:money}},function(err,data){
       if(err)
       console.log(err)
   });

   rupee-=money;
   res.redirect("/allcustomers");

})

app.listen(process.env.PORT || 3000,function(){
    console.log("Process running at port 3000");
})