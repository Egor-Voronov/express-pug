

const express = require("express");
const path = require("path");


const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "..", "public")));


app.get("/", (req, res) => {
  res.render("home", { activeRoute: req.originalUrl });
});


app.get("/promo", (req, res) => {
  res.render("promo", { activeRoute: req.originalUrl });
});
app.get("/catalog", (req, res) => {
  res.render("catalog", { activeRoute: req.originalUrl });
});

app.get("/login", (req, res) => {
  res.render("login", { activeRoute: req.originalUrl });
});
app.get("/registration", (req, res) => {
  res.render("registration", { activeRoute: req.originalUrl });
});


const port = "8080"

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});