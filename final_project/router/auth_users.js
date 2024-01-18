const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter((user)=>{
        return (user.username == username && user.password == password)
    });
    return validUser.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error user logging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message:"User successfully logged in."});
  }else{
    return res.status(208).json({message:"Invalid login"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization['username'];
  
  if(!username) return res.status(208).json({message:"Invalid user"});

    const isbn = req.body.isbn;
    const reviewText = req.body.reviewText;
    const book = books[isbn];

    const userReviewed=false;
    if(book.reviews.length > 0){
        book.reviews.forEach(username => {
            if(book.reviews['username'] === username)
                userReviewed = true;
        });
    }
    if(userReviewed){
        book.reviews.reviewText = reviewText;
    }else{
        book.reviews.username = username;
        book.reviews.reviewText = reviewText;
    }

    return res.status(200).json("User successfully reviewed the book");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
