const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const {getUserByEmail} = require('./views/helper')
const {urlsForUser} = require('./views/helper');
const {generateRandomString} = require('./views/helper');
const PORT = 8080;


app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name:'session',
    keys: ['notASecretKey'],
}));

const urlDatabase = {};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur"),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk"),
  }
};

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const user_id = req.session.userID;
<<<<<<< HEAD
  const templateVars = {userID: user_id, urls: urlDatabase}; 
  if (!user_id) {
    return res.redirect("/login");
  } else {
    templateVars.urls = urlsForUser(user_id, urlDatabase);
=======
  const templateVars = { urls: undefined, userID: undefined};
  if (!user_id) {
    return res.redirect("/login");
  } else {
    templateVars.urls = urlsForUser(user_id.id, urlDatabase);
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
    templateVars["userID"] = user_id
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.userID;
  if (!user_id) {
    return res.redirect("/login");
  } else {
  const templateVars = { userID: req.session.userID };
  res.render("urls_new", templateVars);
  }
});

app.get("/register", (req, res) => {
  const user_id = req.session.userID;
  const templateVars = { userID: user_id, user: users };
  return res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const user_id = req.session.userID;
  if (user_id) {
    return res.redirect("/urls");
  } else {
    const templateVars = { userID: user_id, user: users };
    return res.render("urls_loginpage", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.session.userID;
<<<<<<< HEAD
  let urlID = req.params.id;
  if (!user_id) {
    res.send("ERROR: Not logged in!");
  } else {
    const templateVars = { id: req.params.id, longURL: urlDatabase[urlID].longURL, userID: user_id};
=======
  let urlid = req.params.id;
  if (!user_id) {
    res.send("ERROR: Not logged in!");
  } else {
    const templateVars = { id: req.params.id, longURL: urlDatabase[urlid].longURL, userID: user_id};
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  const foundUser = getUserByEmail(req.body.email, users);
  for (let user in users) {
<<<<<<< HEAD
    if (foundUser) {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
=======
    if (getUserByEmail(req.body.email, users)) {
      if (bcrypt.compareSync(req.body.password, users[user].password)) {
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
        req.session.userID = users[user];
        return res.redirect("/urls");
      } else {
        return res.send("ERROR: Username or password is incorrect");
      }
    } else {
      return res.send("ERROR: Username or password is incorrect");
    }
  };
});

app.post("/register", (req, res) => {
    if (!req.body.email) {
      res.send("Status code 400");
    } else if (getUserByEmail(req.body.email, users)) {
      res.send("Email already in use! Status code 400");
    } else {
      const userID = generateRandomString();
      const email = req.body.email;
      const password = bcrypt.hashSync(req.body.password);
<<<<<<< HEAD
      users[userID] = {id: userID, email: email, password: password};
=======
      users[userID] = {"id": userID, "email": email, "password": password};
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
      req.session.userID = users[userID];
      return res.redirect("/urls");
    };
});

app.post("/urls/new", (req, res) => {
  const user_id = req.session.userID.id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  if(longURL.includes('http://') || longURL.includes('https://')) {
    urlDatabase[shortURL] = {longURL: longURL, userID: user_id};
  } else {
    urlDatabase[shortURL] = {longURL: `http://${longURL}`, userID: user_id};
  }
  return res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const user_id = req.session.userID.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = {longURL: longURL, userID: user_id};
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
<<<<<<< HEAD
  req.session = null;
=======
  req.session.userID = null;
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

