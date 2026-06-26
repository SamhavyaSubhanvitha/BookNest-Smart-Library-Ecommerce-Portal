function getImageName(path){

if(!path) return "atomic.jpg";

return path.split("\\").pop();

}


const API="https://booknest-backend-nxnk.onrender.com";

function getImageName(path){

if(!path) return "";

return path.split("\\").pop();

}


//================ SIGNUP ================

async function signup(){

const email=document.getElementById("emailIp").value;

const password=document.getElementById("passip").value;

const confirm=document.getElementById("passipc").value;

if(password!==confirm){

alert("Passwords do not match");

return;

}

try{

const res=await fetch(`${API}/signup`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

});

const data=await res.text();

alert(data);

if(data==="Signup successful"){

window.location.href="signin.html";

}

}

catch(err){

console.log(err);

}

}

function checkLogin(){

if(sessionStorage.getItem("loggedIn")!=="true"){

alert("Please Sign In to continue.");

window.location.href="signin.html";

return false;

}

return true;

}

//================ SIGNIN ================

async function signin(){

const email=document.getElementById("emailIp").value;

const password=document.getElementById("passip").value;

try{

const res=await fetch(`${API}/signin`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

});

const data=await res.text();

alert(data);

if(data==="Signin successful"){

sessionStorage.setItem("loggedIn","true");

sessionStorage.setItem("email",email);

window.location.href="index.html";

}

}

catch(err){

console.log(err);

}

}

//================ LOGOUT ================

function logout(){

sessionStorage.removeItem("loggedIn");
sessionStorage.removeItem("email");

localStorage.removeItem("cart");
localStorage.removeItem("wishlist");

alert("Logged out successfully");

window.location.href="signin.html";

}

//================ SHOP BOOKS ================

async function loadBooks(){

const container=document.getElementById("shopContainer");

if(!container) return;

container.innerHTML="";

try{

const res=await fetch(`${API}/books`);

const books=await res.json();

console.log(books);
    
books.forEach(book=>{

container.innerHTML+=`

<div class="book-card">

<img src="./images/${book.image}">

<h3>${book.title}</h3>

<p>${book.author}</p>

<p>₹${book.price}</p>

<div class="btn-group">

<button onclick='addToCart(${JSON.stringify(book)})'>

Add To Cart

</button>

<button onclick='addToWishlist(${JSON.stringify(book)})'>

❤ Wishlist

</button>

</div>

</div>

`;

});

}

catch(err){

console.log(err);

}

}


//================ CART ================

function addToCart(book){

if(!checkLogin()) return;

let cart=JSON.parse(localStorage.getItem("cart"))||[];

cart.push(book);

localStorage.setItem("cart",JSON.stringify(cart));

alert("Book added to Cart");

}


function loadCart(){

const container=

document.getElementById(

"cartContainer"

);

if(!container) return;

container.innerHTML="";

let cart=

JSON.parse(

localStorage.getItem("cart")

)||[];


let total=0;


cart.forEach((book,index)=>{

total+=Number(book.price);

container.innerHTML+=`

<div class="cart-card">

<img src="./images/${getImageName(book.image)}">

<h3>${book.title}</h3>

<p>${book.author}</p>

<h4>₹${book.price}</h4>

<button onclick="removeCart(${index})">

Remove

</button>

</div>

`;

});


const totalBox=

document.getElementById(

"totalAmount"

);

if(totalBox){

totalBox.innerHTML=

`Total : ₹${total}`;

}

}


function removeCart(index){

let cart=

JSON.parse(

localStorage.getItem("cart")

)||[];


cart.splice(index,1);

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

loadCart();

}


//================ WISHLIST ================

function addToWishlist(book){

if(!checkLogin()) return;

let wishlist=JSON.parse(localStorage.getItem("wishlist"))||[];

wishlist.push(book);

localStorage.setItem("wishlist",JSON.stringify(wishlist));

alert("Book added to Wishlist");

}

function loadWishlist(){

const container=

document.getElementById(

"wishlistContainer"

);

if(!container) return;

container.innerHTML="";


let wishlist=

JSON.parse(

localStorage.getItem("wishlist")

)||[];


wishlist.forEach((book,index)=>{

container.innerHTML+=`

<div class="wishlist-card">

<img src="./images/${getImageName(book.image)}">

<h3>${book.title}</h3>

<p>${book.author}</p>

<h4>₹${book.price}</h4>

<div class="wishlist-buttons">

<button onclick="moveToCart(${index})">

Add To Cart

</button>

<button onclick="removeWishlist(${index})">

Remove

</button>

</div>

</div>

`;

});

}


function removeWishlist(index){

let wishlist=

JSON.parse(

localStorage.getItem("wishlist")

)||[];


wishlist.splice(index,1);


localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);


loadWishlist();

}


function moveToCart(index){

let wishlist=

JSON.parse(

localStorage.getItem("wishlist")

)||[];


let cart=

JSON.parse(

localStorage.getItem("cart")

)||[];


cart.push(wishlist[index]);

wishlist.splice(index,1);


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);


loadWishlist();

}


//================ BORROW ================

async function borrowBook(){

const title=

document.getElementById(

"title"

).value;


const res=await fetch(

`${API}/taken`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title

})

}

);


const data=

await res.text();

alert(data);

}


//================ RETURN ================

async function returnBook(){

const title=

document.getElementById(

"title"

).value;


const res=await fetch(

`${API}/return`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title

})

}

);


const data=

await res.text();

alert(data);

}


//================ DELETE ================

async function deleteBook(){

const title=

document.getElementById(

"title"

).value;


const res=await fetch(

`${API}/delete`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title

})

}

);


const data=

await res.text();

alert(data);

}


//================ PAYMENT ================

async function payment(){

if(!checkLogin()) return;

const email=sessionStorage.getItem("email");

let cart=JSON.parse(localStorage.getItem("cart"))||[];

let amount=0;

cart.forEach(book=>{

amount+=Number(book.price);

});

await fetch(`${API}/payment`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

amount

})

});

const otpRes=await fetch(`${API}/generateOtp`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email

})

});

const otp=await otpRes.text();

alert("Your OTP : "+otp);

window.location.href="otp.html";

}

//===========Load payment ==========

function loadPaymentAmount(){

const amountBox=document.getElementById("amountDisplay");

if(!amountBox) return;

let cart=JSON.parse(localStorage.getItem("cart"))||[];

let total=0;

cart.forEach(book=>{

total+=Number(book.price);

});

amountBox.innerHTML="₹"+total;

}

//================ OTP ================

async function verifyOtp(){

const email=

sessionStorage.getItem(

"email"

);


const otp=

document.getElementById(

"otp"

).value;


const res=

await fetch(

`${API}/verifyOtp`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

otp

})

}

);


const data=

await res.text();

alert(data);


if(data==="OTP Verified"){

localStorage.removeItem("cart");

window.location.href="success.html";

}

}


//================ ORDERS ================

function loadOrders(){

let container=document.getElementById("ordersContainer");

if(!container)return;

container.innerHTML="";

let orders=[

{

title:"Atomic Habits",

image:"atomic.jpg",

date:"24 June 2026"

},

{

title:"Harry Potter",

image:"harry.jpg",

date:"24 June 2026"

}

];

orders.forEach(order=>{

container.innerHTML+=`

<div class="order-card">

<img src="./images/${order.image}">

<h3>${order.title}</h3>

<p>Order Date : ${order.date}</p>

<span class="status delivered">

Delivered

</span>

</div>

`;

});

}


//================ DASHBOARD ================

async function loadDashboard(){

const container=

document.getElementById(

"dashboard"

);

if(!container) return;


const res=

await fetch(

`${API}/dashboard`

);


const data=

await res.json();


container.innerHTML=`

<div class="stat-card">

<h2>${data.users}</h2>

<p>Users</p>

</div>

<div class="stat-card">

<h2>${data.books}</h2>

<p>Books</p>

</div>

<div class="stat-card">

<h2>${data.orders}</h2>

<p>Orders</p>

</div>

`;

}

async function addBook(){
    console.log("ADD BOOK BUTTON CLICKED");

const title=document.getElementById("title").value;

const author=document.getElementById("author").value;

const category=document.getElementById("category").value;

const description=document.getElementById("description").value;

const image=document.getElementById("image").files[0].name;

const price=document.getElementById("price").value;

const copies=document.getElementById("copies").value;

try{

const res=await fetch(`${API}/addBook`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title,

author,

category,

description,

image,

price,

availableCopies:copies

})

});

const data=await res.text();

alert(data);

if(data==="Book Added"){

window.location.href="shop.html";

}

}

catch(error){

console.log(error);

}

}
