const express = require("express");
const cookieparser = require("cookie-parser");
const app = express();
const morgan = require('morgan');
const PORT = 8080;

app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

const urlDatabase = {};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
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
  const user_id = req.cookies.userID;
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
  const user_id = req.cookies.userID;
  if (!user_id) {
    return res.redirect("/urls/login");
  } else {
  const templateVars = { userID: req.cookies.userID };
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/register", (req, res) => {
  const user_id = req.cookies.userID;
  const templateVars = { userID: req.cookies.userID, user: users };
  return res.render("urls_register", templateVars);
});

app.get("/urls/login", (req, res) => {
  const user_id = req.cookies.userID;
  if (user_id) {
    return res.redirect("/urls");
  } else {
    const templateVars = { userID: req.cookies.userID, user: users };
    return res.render("urls_loginpage", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies.userID;
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
    if (users[user].email === req.body.email) {
      if (users[user].password === req.body.password) {
        res.cookie("userID", users[user]);
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
  for (let user in users) {
    if (req.body.email === "") {
      res.send("Status code 400");
    } else if (req.body.email === users[user].email) {
      res.send("Email already in use! Status code 400");
    } else {
      const userID = generateRandomString();
      const email = req.body.email;
      const password = req.body.password;
      users[userID] = {"id": userID, "email": email, "password": password};
      res.cookie("userID", users[userID]);
      return res.redirect("/urls");
    };
  }
});

app.post("/urls/new", (req, res) => {
  const user_id = req.cookies.userID;
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
  res.clearCookie('userID');
  res.redirect("/urls/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

