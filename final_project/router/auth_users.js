const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:String,password:String}];

const isValid = (username) => { 
  for (let user of users) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
};


const authenticatedUser = (username,password)=>{ 
  if( isValid(username) ){
    for (let user of users) {
      if (user.username === username && user.password === password) {
        return true;
      }
    }
  }
  return false;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  if(authenticatedUser(req.body.username,req.body.password)){
    const token = jwt.sign({user:req.body.username}, "fingerprint_customer")
    return res.status(200).json({token:token});
  }
  return res.status(401).json({message:"Invalid credentials"});
});

// this work as add and update review !!
regd_users.put("/auth/review/:isbn", (req, res) => {
  const comment = req.body.comment;
  const isbn = req.params.isbn;
  console.log(req.body.username);
  books[isbn].reviews[req.session.username] = comment;
  return res.status(200).json({ message: "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  delete books[isbn].reviews[req.session.username];
  return res.status(200).json({ message: "Review deleted successfully" });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;




// node.js async functions

async function getAllBooksAsync(books){
  return books;
}

getAllBooksAsync(books)
.then((books)=>console.log(books));



function searchByisbn(isbn){
  return new Promise((resolve,reject)=>{
    if(books[isbn]){
      resolve(books[isbn]);
    }else{
      reject("Book not found");
    }
  });
}

searchByisbn(1)
.then((book)=>console.log(book))
.catch((err)=>console.log(err));



function searchByAuthor(author, callback){
  let booksAuthor = [];
  for (let key in books) {
    if (books[key].author === author) {
      booksAuthor.push(books[key]);
    }
  }
  callback(booksAuthor);
}

searchByAuthor("Unknown", (booksAuthor)=>
  console.log(booksAuthor)
 );



 function searchByTitle(title){
  return new Promise((resolve,reject)=>{
    let booksTitle = [];
    for (let key in books) {
      if (books[key].title === title) {
        booksTitle.push(books[key]);
      }
    }
    if(booksTitle.length>0){
      resolve(booksTitle);
    }else{
      reject("Book not found");
    }
  });}

searchByTitle("Fairy talesa")
.then((booksTitle)=>console.log(booksTitle))
.catch((err)=>console.log(err));