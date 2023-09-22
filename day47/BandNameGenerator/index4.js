import express from "express";
import { dirname } from "path"
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url))

const port = 3000;
const app = express();


app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.post("/submit", (req,res)=> {
  res.send(`<h1>Your Band name is...</h1> <h1>${req.body.street} ${req.body.pet}✌️</h1>`)
  
})





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
