const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
    apiKey: "e688efd1d2f39db8b613108721c45643-us21",
    server: "us21",
  });

  async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);
  }
  
  run();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    const listId = "206ed33f71"


    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: fname,
            LNAME: lname
          }
        });
        console.log("success");
        
    }
    run();
    // const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/206ed33f71"

    const options = {
        
        method: "POST",
        
        
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/success.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    // request.write(jsonData);
    request.end();


});

app.post("/failure", function(req,res){
    res.redirect("/");
})




app.listen(process.env.PORT || 3000, function(){
    console.log("Server is active");
})
//e688efd1d2f39db8b613108721c45643-us21
//list id
// 206ed33f71