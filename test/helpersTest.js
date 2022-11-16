const { assert } = require('chai');

const {getUserByEmail} = require('../views/helper');

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