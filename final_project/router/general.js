const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fs = require('fs/promises');
const path = require('path');

function doesExist(username) {
    let sameusername = users.filter((user) => {
        return (user.username = username);
    });

    return sameusername.length > 0 ? true : false;
}
public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ username: username, password: password });
            return res
                .status(200)
                .json({ message: "User is successfully registered." });
        } else {
            return res.status(404).json({ message: "User already exists." });
        }
    } else {
        return res.status(404).json({ message: "Unable to register" });
    }
});

// Get the book list available in the shop
public_users.get("/", async(req, res)=>{
    //Write your code here
    try {
        // Promise.resolve(books).then((results)=>{
        //     return res.status(200).send(results);
        // });    

        // const filePath = path.join(__dirname,'booksdb.js');

        // const data = await fs.readFile(filePath, 'utf-8');

        // console.log(data)
        const filePath =path.join(__dirname,'booksdb.js');
        const fileContent = await fs.readFile(filePath,'utf-8');

        const jsonData =eval(fileContent);
        return res.status(200).send(jsonData);
    } catch (error) {
        console.log(error);
    }

    // )return  JSON.stringify(res.data, null, 4);
});
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.body.isbn;
    return res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    //Write your code here
    const author = req.body.author;
    const booksByAuthor = Object.entries(books).reduce(
        (filteredBooks, [isbn, book]) => {
            if (book.author == author) {
                filteredBooks[isbn] = book;
            }
            return filteredBooks;
        },
        {}
    );
    return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    //Write your code here
    const title = req.body.title;
    const booksByTitle = Object.entries(books).reduce(
        (filteredBooks, [isbn, book]) => {
            if (book.title == title) {
                filteredBooks[isbn] = book;
            }
            return filteredBooks;
        },
        {}
    );
    return res.send(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    const isbn = req.body.isbn;
    const reviewedBook = books[isbn];
    return res.send(reviewedBook.reviews);
});

module.exports.general = public_users;
