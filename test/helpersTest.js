const { assert } = require('chai');

<<<<<<< HEAD
const {getUserByEmail} = require('../views/helper');
=======
const getUserByEmail = require('../views/helper');
>>>>>>> b83aabd4d15e558d88cdd83c7483efe0ff98ba2e

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    assert.equal(user, true);
  });

  it('should return false with an invalid email', function() {
    const user = getUserByEmail("", testUsers)
    assert.equal(user, false);
  });
});