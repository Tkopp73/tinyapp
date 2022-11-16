const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
<<<<<<< HEAD
      return database[user];
    }
  }
=======
      return true;
    }
  }
  return false;
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
};

const urlsForUser = (id, urlDatabase) => {
  let userURLS = {};
  for (let url in urlDatabase) {
<<<<<<< HEAD
    if (urlDatabase[url].userID === id.id) {
=======
    if (urlDatabase[url]["userID"] === id) {
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e
      userURLS[url] = urlDatabase[url];
    }
  }
  return userURLS;
};

const generateRandomString = () => {  
  const randomString = (Math.random() + 1).toString(36).substring(7);
  return randomString;
};

module.exports = {getUserByEmail, urlsForUser, generateRandomString};
