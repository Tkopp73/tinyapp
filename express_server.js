const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

generateRandomString = () => {  
  const randomString = (Math.random() + 1).toString(36).substring(7);
  return randomString;
}

app.get("/", (req, res) => {
  res.redirect('/urls')
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("urls/:id", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/new", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  if(longURL.includes('http://') || longURL.includes('https://')) {
    urlDatabase[shortURL] = req.body.longURL;
  } else {
    urlDatabase[shortURL] = `http://${req.body.longURL}`;
  }
  res.redirect(`/urls`);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});