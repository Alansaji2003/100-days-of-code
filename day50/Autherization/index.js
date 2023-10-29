import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "alan2003";
const yourPassword = "Alansaji@220303";
const yourAPIKey = "2fb7fedf-f860-4567-8f52-f2cc509c3e9a";
const yourBearerToken = "f6bd98e7-c1e6-4029-921d-5d3089ba921c";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try{
    const response = await axios.get(`${API_URL}random`)
    const result = response.data
    let jsonData = JSON.stringify(result)
    res.render("index.ejs", {content : jsonData})
  }catch (error){
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
      content:error.message
    });

  }
    
  
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
 try {
  const response = await axios.get(`${API_URL}all?page=1`, {
        auth:{
          username:yourUsername,
          password : yourPassword,
        },
      });
      const result = response.data
      let jsonData = JSON.stringify(result)
      res.render("index.ejs", {content : jsonData})
 }catch (error){
  console.error("Failed to make request", error.message)
  res.render("index.ejs", {
    error: error.message,
    content:error.message
  });
 }
      


});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  try{
    const response = await axios.get(`${API_URL}filter`,{
      params : {
      score : 5,
      apiKey : yourAPIKey
    }} )
    const result = response.data
    const jsonData = JSON.stringify(result)
    res.render("index.ejs", {content : jsonData})
  }catch(error){
    console.error("Failed to fetch request", error.message)
    res.render("index.ejs", {
      error : error.message,
      content: error.message
    })
  }
});

const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  try{
    const response  = await axios.get(`${API_URL}secrets/1`, config)
    const result = response.data
    const jsonData = JSON.stringify(result)
    res.render("index.ejs", {
      content : jsonData
    })
  }catch (error){
    console.error('Cant fetch', error.message)
    res.render("index.ejs", 
    {error : error.message,
    content: error.message}
    )
  }
  
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
