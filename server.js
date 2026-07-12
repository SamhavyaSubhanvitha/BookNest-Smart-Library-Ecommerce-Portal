const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)

.then(()=>{

console.log("MongoDB Connected");

})

.catch((err)=>{

console.log(err);

});


//================ USERS ==================
const userSchema = new mongoose.Schema({

email:String,

password:String

},
{
timestamps:true

});

const User = mongoose.model("User",userSchema);


//================ BOOKS ==================

const bookSchema = new mongoose.Schema({

title:String,

author:String,

category:String,

description:String,

image:String,

price:Number,

availableCopies:Number,

status:String,

rating:Number
},
{
    timestamps:true
});

const Book = mongoose.model("Book",bookSchema);


//================ CART ==================

const cartSchema = new mongoose.Schema({

userEmail:String,

bookId:String,

title:String,

price:Number,

quantity:Number
},
{
timestamps:true

});

const Cart = mongoose.model("Cart",cartSchema);


//================ WISHLIST ==================

const wishlistSchema = new mongoose.Schema({

userEmail:String,

bookId:String,

title:String
},
{
timestamps:true

});

const Wishlist = mongoose.model("Wishlist",wishlistSchema);


//================ ORDERS ==================

const orderSchema = new mongoose.Schema({

userEmail:String,

books:Array,

totalAmount:Number,

status:String,

orderDate:{

type:Date,

default:Date.now

}
},
{
timestamps:true

});

const Order = mongoose.model("Order",orderSchema);

//================ OTP ==================

const otpSchema = new mongoose.Schema({

email:String,

otp:String,

createdAt:{

type:Date,

default:Date.now,

expires:300

}
},
{
timestamps:true

});

const Otp = mongoose.model("Otp",otpSchema);


//================ PAYMENT ==================

const paymentSchema = new mongoose.Schema({

userEmail:String,

amount:Number,

status:String,

transactionId:String,

createdAt:{

type:Date,

default:Date.now

}
},
{
timestamps:true

});

const Payment = mongoose.model("Payment",paymentSchema);

app.get("/", (req,res)=>{
    res.send("BookNest Backend Running");
});

//================ READER WALL ==================

const readerWallSchema = new mongoose.Schema({

    userEmail:String,

    bookTitle:String,

    message:String,

    verifiedBuyer:Boolean,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

const ReaderWall = mongoose.model("ReaderWall",readerWallSchema);

//================ AUTHOR MESSAGES ==================

const messageSchema = new mongoose.Schema({

userEmail:String,

bookId:String,

bookTitle:String,

author:String,

message:String,

createdAt:{

type:Date,

default:Date.now

}

},
{
timestamps:true
});

const Message = mongoose.model("Message",messageSchema);

//==========User Experience ===================

const experienceSchema = new mongoose.Schema({

userEmail:String,

bookTitle:String,

message:String,

createdAt:{
type:Date,
default:Date.now
}

});

const Experience = mongoose.model("Experience", experienceSchema);

//================ SPAM FILTER ==================

function isSpam(message){

message = message.toLowerCase();

const spamKeywords = [

"winner",
"congratulation",
"claim prize",
"earn money",
"lottery",
"click here",
"free recharge",
"cash prize",
"free gift"

];

if(message.includes("http://") || message.includes("https://")){

return true;

}

if(message.includes("www.")){

return true;

}

const phoneRegex=/\b\d{10}\b/;

if(phoneRegex.test(message)){

return true;

}

for(const word of spamKeywords){

if(message.includes(word)){

return true;

}

}

return false;

}

//=========signup====
app.post("/signup",async(req,res)=>{

try{

const user=await User.findOne({

email:req.body.email

});

if(user){

return res.send("User already exists");

}

const newUser=new User({

email:req.body.email,

password:req.body.password

});

await newUser.save();

res.send("Signup successful");

}

catch(error){

res.status(500).send(error);

}

});


//================ SIGNIN ==================

app.post("/signin",async(req,res)=>{

try{

const user=await User.findOne({

email:req.body.email,

password:req.body.password

});

if(!user){

return res.status(404)

.send("Account not found");

}

res.send("Signin successful");

}

catch(error){

res.status(500).send(error);

}

});


//================ GET BOOKS ==================

app.get("/books",async(req,res)=>{

const books=await Book.find();

res.send(books);

});


//================ BORROW ==================

app.post("/taken",async(req,res)=>{

const book=await Book.findOne({

title:req.body.title

});

if(!book){

return res.status(404)

.send("Book not found");

}

if(book.availableCopies>0){

book.availableCopies--;

await book.save();

res.send("Book allocated");

}

else{

res.send("Book unavailable");

}

});


//================ RETURN ==================

app.post("/return",async(req,res)=>{

const book=await Book.findOne({

title:req.body.title

});

if(!book){

return res.status(404)

.send("Book not found");

}

book.availableCopies++;

await book.save();

res.send("Book returned");

});


//================ DELETE ==================

app.post("/delete",async(req,res)=>{

const book=await Book.findOne({

title:req.body.title

});

if(!book){

return res.status(404)

.send("Book not found");

}

await Book.deleteOne({

title:req.body.title

});

res.send("Book deleted");

});


//================ CART ==================

app.post("/cart/add",async(req,res)=>{

const item=new Cart(req.body);

await item.save();

res.send("Added to cart");

});

app.get("/cart",async(req,res)=>{

const cart=await Cart.find();

res.send(cart);

});

app.delete("/cart/:id",async(req,res)=>{

try{

await Cart.findByIdAndDelete(req.params.id);

res.send("Cart item deleted");

}

catch(error){

res.status(500).send(error);

}

});


//================ WISHLIST ==================

app.post("/wishlist/add",async(req,res)=>{

const item=new Wishlist(req.body);

await item.save();

res.send("Added to wishlist");

});

app.get("/wishlist",async(req,res)=>{

const data=await Wishlist.find();

res.send(data);

});

app.delete("/wishlist/:id",async(req,res)=>{

try{

await Wishlist.findByIdAndDelete(req.params.id);

res.send("Wishlist item deleted");

}

catch(error){

res.status(500).send(error);

}

});

//============== User Experience===================
app.post("/experience", async(req,res)=>{

try{

const experience = new Experience({

userEmail:req.body.userEmail,

bookTitle:req.body.bookTitle,

message:req.body.message

});

await experience.save();

res.send({

success:true

});

}

catch(error){

res.status(500).json({

success:false
});

}

});

//

app.get("/experience/:bookTitle",async(req,res)=>{

const data=await Experience.find({

bookTitle:req.params.bookTitle

});

res.json(data);

});

//================ AUTHOR MESSAGE ==================

app.post("/authorMessage",async(req,res)=>{

try{

const{

userEmail,

bookId,

bookTitle,

author,

message

}=req.body;

if(isSpam(message)){

return res.status(400).json({

success:false,

message:"Spam message detected"

});

}

const newMessage=new Message({

userEmail,

bookId,

bookTitle,

author,

message

});

await newMessage.save();

res.json({

success:true,

message:"Message sent successfully"

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false

});

}

});

//================= Get Messages ==========

app.get("/messages",async(req,res)=>{

const messages=await Message.find();

res.json(messages);

});

//===================Delete messages===========

app.delete("/messages/:id",async(req,res)=>{

await Message.findByIdAndDelete(req.params.id);

res.send("Deleted");

});

//================ ORDERS ==================

app.post("/orders",async(req,res)=>{

const order=new Order({

userEmail:req.body.userEmail,

books:req.body.books,

totalAmount:req.body.totalAmount,

status:"Pending"

});

await order.save();

res.send("Order placed");

});

app.get("/orders",async(req,res)=>{

const orders=await Order.find();

res.send(orders);

});

app.delete("/orders/:id",async(req,res)=>{

try{

await Order.findByIdAndDelete(req.params.id);

res.send("Order deleted");

}

catch(error){

res.status(500).send(error);

}

});

app.get("/orders/:email", async(req,res)=>{

try{

const orders = await Order.find({

userEmail:req.params.email

});

res.send(orders);

}

catch(err){

res.status(500).send(err);

}

});

//================ DASHBOARD ==================

app.get("/dashboard",async(req,res)=>{

const users=await User.countDocuments();

const books=await Book.countDocuments();

const orders=await Order.countDocuments();

res.send({

users,

books,

orders

});

});

app.post("/generateOtp",async(req,res)=>{

const otp=Math.floor(

100000+Math.random()*900000

).toString();

await Otp.deleteMany({

email:req.body.email

});

const newOtp=new Otp({

email:req.body.email,

otp:otp

});

await newOtp.save();

res.send(otp);

});

app.post("/verifyOtp",async(req,res)=>{

const data=await Otp.findOne({

email:req.body.email,

otp:req.body.otp

});

if(!data){

return res.status(400)

.send("Invalid OTP");

}

res.send("OTP Verified");

});

//====payment=====

app.post("/payment",async(req,res)=>{

try{

const transactionId="TXN"+Date.now();

const payment=new Payment({

userEmail:req.body.email,

amount:req.body.amount,

status:"Success",

transactionId

});

await payment.save();

res.send({

message:"Payment Successful",

transactionId

});

}

catch(error){

console.log(error);

res.status(500).send("Payment Failed");

}

});

app.get("/payments", async (req,res)=>{

try{

const payments = await Payment.find();

res.send(payments);

}

catch(error){

res.status(500).send(error);

}

});

//================ ADD BOOK ==================

app.post("/addBook",async(req,res)=>{

try{

const book=new Book({

title:req.body.title,

author:req.body.author,

category:req.body.category,

description:req.body.description,

image:req.body.image,

price:req.body.price,

availableCopies:req.body.availableCopies,

status:"available",

rating:5

});

await book.save();

res.send("Book Added");

}

catch(error){

console.log(error);

res.status(500).send("Error");

}

});

app.delete("/wishlist/:id",

async(req,res)=>{

await Wishlist.findByIdAndDelete(

req.params.id

);

res.send("Removed");

});

//================ READER WALL ==================

app.post("/readerWall", async(req,res)=>{

try{

const{

userEmail,

bookTitle,

message

}=req.body;


// Character limit

if(message.length>250){

return res.status(400).send({

success:false,

message:"Maximum 250 characters."

});

}

app.get("/readerWall/:bookTitle",async(req,res)=>{

const data=await ReaderWall.find({

bookTitle:req.params.bookTitle

});

res.send(data);

});

// Check purchase

const order=await Order.findOne({

userEmail:userEmail

});


if(!order){

return res.status(403).send({

success:false,

message:"Only verified buyers can post."

});

}


// Save

const post=new ReaderWall({

userEmail,

bookTitle,

message,

verifiedBuyer:true

});

await post.save();

res.send({

success:true,

message:"Experience shared successfully."

});

}

catch(err){

console.log(err);

res.status(500).send(err);

}

});

app.listen(PORT,()=>{

console.log(`Server running on ${PORT}`);

});
