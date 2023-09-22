import bodyParser from "body-parser";
import  Express  from "express";
import {dirname} from "path"
import { fileURLToPath } from "url";
const __direname = dirname(fileURLToPath(import.meta.url))
const app = Express()
const port = 3000

app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res) => {
    res.sendFile(__direname+"/public/index.html")
})

app.post("/check", (req,res) =>{
    if(req.body.password == "ILoveProgramming"){
        res.sendFile(__direname+"/public/secret.html")
    }
    else{
        res.sendFile(__direname+"/public/index.html")
    }
})




app.listen(3000, () =>{
    console.log(`Server active at port ${port}`)
})