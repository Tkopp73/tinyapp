const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return true;
    }
  }
  return false;
};

const urlsForUser = (id, urlDatabase) => {
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

module.exports = {getUserByEmail, urlsForUser, generateRandomString};
