import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  database:"To-do-List",
  host:"localhost",
  password:"alansaji2003",
  port:5432
})

db.connect();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
    const result = await db.query("SELECT * FROM list");
    items = []
    result.rows.forEach(item =>{
      items.push(item);
    })
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch{
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const result = await db.query("INSERT INTO list (title) VALUES ($1);",[item])
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit",async (req, res) => {
const updateItem = req.body.updatedItemTitle;

const updateitemid = req.body.updatedItemId;
const result = await db.query("UPDATE list SET title = $1 WHERE id = $2;",[updateItem,updateitemid])
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId
db.query("DELETE FROM list WHERE id = $1",[id]);
res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
