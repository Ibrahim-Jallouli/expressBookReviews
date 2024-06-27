const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(isValid(req.body.username)){
    return res.status(400).json({message:"User already exists"});
  }
  users.push({username:req.body.username,password:req.body.password});
  return res.status(200).json({message:"User created successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author.toString();
  console.log(author);
  let booksAuthor = [];
  for (let key in books) {
    if (books[key].author === author) {
      booksAuthor.push(books[key]);
    }
  }
  return res.status(200).json(booksAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title.toString();
  let booksTitle = [];
  for (let key in books) {
    if (books[key].title === title) {
      booksTitle.push(books[key]);
    }
  }
  return res.status(200).json(booksTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 let isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
