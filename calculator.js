const express = require("express");
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.get("/bmicalculator", function(req,res){
    res.sendFile(__dirname+"/bmiCalculator.html");
})

app.post("/", function(req,res){
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    res.send(num1+ " + "+num2+" is " +result);
})

app.post("/bmicalculator", function(req, res){
    var height = parseFloat(req.body.h);
    var weight = parseFloat(req.body.w);
    var bmi = weight/(height * height);
    res.send("Your BMI is "+bmi);
})

app.listen(3000, function(){
    console.log("Server active at port 3000");
})