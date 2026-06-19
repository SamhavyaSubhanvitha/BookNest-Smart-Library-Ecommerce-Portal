const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const app = express();
const server = "127.0.0.1:27017";
const db = "library";
const PORT=3000;
const cors = require('cors');
app.use(cors());

const mongoConnection = mongoose.connect(`mongodb://${server}/${db}`)
.then(() => {
    console.log('database connection successful');
})
.catch((err) => {
    console.log('database connection is failed'+err);
});

const userSchema = new mongoose.Schema({
  email: String,
  password:String
});
const User = mongoose.model('user', userSchema);

const bookSchema = new mongoose.Schema({
  name: String,
  price: Number,
  status: String 
});
const Book = mongoose.model('book', bookSchema);

app.get("/",jsonParser,(req, res) => {
  res.send("HELLO FROM LIBRARY");
});

app.post("/signup",jsonParser,(req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password 
  });

  newUser.save()
    .then(() => {
      res.send("Signup is successful" );
    })
    .catch((error) => {
      console.error(error);
      res.send("Signup failed. Email might already exist." );
    });
});

app.post("/signin",jsonParser,async (req, res) => {
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    const userReturns = await User.find({
        email: reqEmail,
        password: reqPassword
    });
    if (userReturns.length > 0) {
        console.log("sign in successful");
        res.send("signin successful");
    }
    else {
        console.log("signin failed");
        res.status(404).send("Account not found. Please signup first.") ;
    }
    res.send(userReturns);
});

app.post("/addBook",jsonParser,(req,res) => {
  console.log("got data:",req.body);
  const newBook = new Book({
    name:req.body.name,
    price:req.body.price,
    status:req.body.status
  });
  newBook.save()
  .then(() => {
    console.log("added details");
    res.send("Book added");
    })
  .catch((error) => {
      console.error(error);
    });  
});

app.post("/taken",jsonParser,async (req, res) => {
  console.log("the taken route",req.body);
  const bookReturns = await Book.find({
    name:req.body.name
  });
    console.log(bookReturns[0]);

    if(bookReturns[0].length === 0)
    {
      return res.status(404).send("Book not found");
    }
    if(bookReturns[0].status === "available"){
      await Book.updateOne(
        {name:req.body.name},
        {status:"not available"}
      );
      res.send("Book has been allocated to you");
    }
    else{
      console.log("book is not available");
      res.send("this book is not available");
    }  
});

app.post("/return",jsonParser,async (req, res) => {
  console.log("the return route",req.body);
  const bookReturns = await Book.find({
    name:req.body.name
  });
    console.log(bookReturns[0]);

    if(bookReturns[0].length === 0){
      return res.status(404).send("Book not found");
    }

    if(bookReturns[0].status == "not available")
    {
      console.log("Trying to give the book and set status");
        await Book.updateOne({name:req.body.name},{status:"available"}).then(
          console.log("update is done")
        )
        .catch((error) => {
          console.error(error);
        });
        res.send("book is available");
    }
    else{
      console.log("book is not available");
      res.send("this book is not available");
    }  
});

app.post("/delete",jsonParser,async (req, res) => {
  console.log("the delete route",req.body);
  const bookReturns = await Book.find({
    name:req.body.name
  });
    console.log(bookReturns[0]);

    if(bookReturns[0].length === 0){
      return res.status(404).send("Book not found");
    }

    if(bookReturns[0].status ==="available")
    {
      console.log("Trying to give the book and set status");
        await Book.deleteOne({name:req.body.name}).then(
          console.log("deletion is done")
        )
        .catch((error) => {
          console.error(error);
        });
        res.send("book has been deleted");
    }
    else{
      console.log("book is not available");
      res.send("this book is not available");
    }  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
