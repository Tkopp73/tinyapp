const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const getUserByEmail = require('./views/helper')
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

const urlsForUser = (id) => {
  let userURLS = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url]["userID"] === id) {
      userURLS[url] = urlDatabase[url];
    }
  }
  return userURLS;
};

const generateRandomString = () => {  
  const randomString = (Math.random() + 1).toString(36).substring(7);
  return randomString;
};

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const user_id = req.session.userID;
  const templateVars = { urls: undefined, userID: undefined};
  if (!user_id) {
    return res.redirect("/urls/login");
  } else {
    templateVars.urls = urlsForUser(user_id.id);
    templateVars["userID"] = user_id
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.userID;
  if (!user_id) {
    return res.redirect("/urls/login");
  } else {
  const templateVars = { userID: req.session.userID };
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/register", (req, res) => {
  const user_id = req.session.userID;
  const templateVars = { userID: req.session.userID, user: users };
  return res.render("urls_register", templateVars);
});

app.get("/urls/login", (req, res) => {
  const user_id = req.session.userID;
  if (user_id) {
    return res.redirect("/urls");
  } else {
    const templateVars = { userID: req.session.userID, user: users };
    return res.render("urls_loginpage", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.session.userID;
  if (!user_id) {
    res.send("ERROR: Not logged in!");
  } else {
    console.log(urlDatabase[req.params.id].longURL);
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, userID: user_id};
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  for (let user in users) {
    if (getUserByEmail(req.body.email, users)) {
      if (bcrypt.compareSync(req.body.password, users[user].password)) {
        req.session.userID = users[user];
        return res.redirect("/urls");
      } else {
        res.send("ERROR: Username or password is incorrect");
      }
    } else {
      res.send("ERROR: Username or password is incorrect");
    }
  };
});

app.post("/register", (req, res) => {
    if (req.body.email === "") {
      res.send("Status code 400");
    } else if (getUserByEmail(req.body.email, users)) {
      res.send("Email already in use! Status code 400");
    } else {
      const userID = generateRandomString();
      const email = req.body.email;
      const password = bcrypt.hashSync(req.body.password);
      users[userID] = {"id": userID, "email": email, "password": password};
      req.session.userID = users[userID];
      return res.redirect("/urls");
    };
});

app.post("/urls/new", (req, res) => {
  const user_id = req.session.userID;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  if(longURL.includes('http://') || longURL.includes('https://')) {
    urlDatabase[shortURL] = {"longURL": longURL, userID: user_id.id};
  } else {
    urlDatabase[shortURL] = {"longURL": `http://${longURL}`, userID: user_id.id};
  }
  return res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session.userID = null;
  res.redirect("/urls/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

