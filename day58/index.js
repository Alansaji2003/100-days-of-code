import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const db = new pg.Client({
  user:"postgres",
  database:"MyFirstDB",
  host:"localhost",
  password:"alansaji2003",
  port:5432
})

db.connect()

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


var countries =[]
app.get("/", async (req, res) => {
  //Write your code here.
  countries = []
  const result = await db.query("SELECT country_code FROM visited_countries");
  result.rows.forEach(item =>{
    countries.push(item.country_code)
  })
  res.render("index.ejs", {total : countries.length, countries:countries})


});

app.post("/add", async (req, res)=> {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisisted();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisisted();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }

})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
