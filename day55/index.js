import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

//get date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');

const formattedDate = `${year}-${month}-${day}T10:00:00Z`;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts
app.get("/posts", (req, res) => {
    res.json(posts)
})
//CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", (req, res)=> {
  const id = req.params.id;
  res.json(posts[id - 1])
})
//CHALLENGE 3: POST a new post
app.post("/posts", (req, res)=>{
  if(req.body.title && req.body.content && req.body.author){
    const new_post = {
      id: posts.length + 1,
      title: req.body.title,
      content:
      req.body.content,
      author: req.body.author,
      date: formattedDate,
    }
    
    posts.push(new_post)
    console.log(posts[posts.length -1]);
    res.json(new_post)
  }else{
    res.sendStatus().json({error:"no data"})
  }
  


})

//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch("/posts/:id", (req, res)=> {
  try{
    const Id = parseInt(req.params.id)
    const exist = posts.find(item => item.id === Id )
    const patch_post = {
    id : Id,
    title: req.body.title || exist.title,
    content: req.body.content || exist.content,
    author: req.body.author || exist.author,
    date: formattedDate
  }
  const selectIndex = posts.findIndex(item => item.id === Id)
  posts[selectIndex] = patch_post
  res.json(patch_post)

  }catch(error){
    res.sendStatus(400).json({error: "Cant patch"})
  }
  

})

//CHALLENGE 5: DELETE a specific post by providing the post id.

app.delete("/posts/:id", (req, res) =>{
  const ID = parseInt(req.params.id)
  const index = posts.findIndex(item => item.id === ID )
  posts.splice(index, 1);
  res.sendStatus(200)
  
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
