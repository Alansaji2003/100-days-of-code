const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){


    res.sendFile(__dirname+"/index.html")

    
});

app.use(express.static("css"));


app.post("/", function(req, res){
    const place = req.body.cityName;
    const apikey = "13a8cbeadf8906cb720752ac7d90e0e1";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+place+"&units="+unit+"&appid="+apikey;
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const humidity = weatherData.main.humidity;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
            

            
            res.write("<h1>The temperature of "+place+" is "+temp+" degree celcius</h1>")
            res.write("<h1>The humidity is "+humidity+"</h1>")
            res.write("<h1>The weather is currently "+weatherDescription+"</h1>")
            res.write("<img src="+imageURL+">");
            res.send();
        })
        
    });
})







app.listen(3000, function(){
    console.log("Server is running on port 3000");
})