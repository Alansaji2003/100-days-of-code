const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname+"/date.js")

var items = ["Start from below"]
let workItems = []

const app = express()

app.set('view engine', 'ejs')                     //for EJS
app.use(bodyParser.urlencoded({extended:true}))   //for body-parser
app.use(express.static(__dirname + '/public'));




app.get("/", function(req,res){
    let currentDate = date();
    res.render('list', {ListTitle:currentDate,newListItem: items,goback: "Go to work list", href:"/work"})
})

app.post("/", function(req,res){

    item = req.body.newitem
    if(req.body.list === "Work List"){
        workItems.push(item)
        res.redirect("/work")
    } else{
        items.push(item);
        res.redirect("/")
    }
    
})

app.get("/work", function(req,res){
    res.render('list', {ListTitle: "Work List", newListItem: workItems, goback: "Go to to do list", href:"/"});
      
})

app.get("/about", function(req,res){
    res.render('about')
})



app.listen(3000, function(){
    console.log("Server is active at port 3000");
})