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

<div class="btn-row">

<button onclick='addToCart(${JSON.stringify(book)})'>
🛒 Add To Cart
</button>

<button onclick='addToWishlist(${JSON.stringify(book)})'>
❤ Wishlist
</button>

</div>

<div class="btn-row">

<button onclick='openMessagePopup(${JSON.stringify(book)})'>
📩 Message Author
</button>

${getBookButton(book.title)}

</div>

</div>

</div>

`;

});

}

catch(err){

console.log(err);

}

}

//======== get book button =============
function getBookButton(title){

const previewBooks=[
"Alice in Wonderland",
"Pride and Prejudice",
"The Time Machine",
"The Adventures of Sherlock Holmes",
"The Wonderful Wizard of Oz",
"The Adventures of Tom Sawyer"
];

if(previewBooks.includes(title)){

return `
<button onclick='readSample("${title}")'>
📖 Read Preview
</button>
`;

}

return `
<button onclick='viewDetails("${title}")'>
📚 View Details
</button>
<button onclick='openReaderWall("${title}")'>
📖 Reader Wall
</button>
`;

}

//========message pop up =================

let selectedBook=null;

function openMessagePopup(book){

selectedBook=book;

document.getElementById("messagePopup").style.display="flex";

}

function closePopup(){

document.getElementById("messagePopup").style.display="none";

document.getElementById("authorMessage").value="";

}

//==========Author msg =============

async function sendAuthorMessage(){

const message=document.getElementById("authorMessage").value;

const userEmail=localStorage.getItem("email");

const res=await fetch(`${API}/authorMessage`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

userEmail:userEmail,

bookId:selectedBook._id,

bookTitle:selectedBook.title,

author:selectedBook.author,

message:message

})

});

const data=await res.json();

if(data.success){

alert(" Message Sent Successfully");

closePopup();

}

else{

alert(" Spam Message Detected");

}

}

//==============Read sample ===========

function readSample(title){

    let file = "";

    switch(title){

        case "Alice in Wonderland":
            file = "Alice_in_Wonderland.pdf";
            break;

        case "The Adventures of Sherlock Holmes":
            file = "advs.pdf";
            break;

        case "Pride and Prejudice":
            file = "pride-and-prejudice.pdf";
            break;

        case "The Time Machine":
            file = "the-time-machine.pdf";
            break;

        default:
            alert("Preview not available for this book.");
            return;
    }

    window.open(`samples/${file}`, "_blank");
}

//===========close details============

function closeDetails(){

document.getElementById("detailsPopup").style.display="none";

}

//==========View Details=========

function viewDetails(title){

console.log("Clicked title:", title);

let details={

"Atomic Habits":{

author:"James Clear",

genre:"Self Help",

published:"2018",

pages:"320",

description:"Atomic Habits explains how tiny daily improvements lead to remarkable long-term results.",

highlights:[
"Small habits create big changes.",
"Focus on systems instead of goals.",
"Make habits obvious and easy.",
"Consistency beats perfection."
]

},

"Harry Potter":{

author:"J.K. Rowling",

genre:"Fantasy",

published:"1997",

pages:"309",

description:"Harry Potter follows a young wizard discovering friendship, courage and magic.",

highlights:[
"Friendship",
"Courage",
"Magic School",
"Adventure"
]

},

"Wings of Fire":{

author:"A.P.J. Abdul Kalam",

genre:"Autobiography",

published:"1999",

pages:"180",

description:"The inspiring autobiography of Dr. A.P.J. Abdul Kalam from childhood to becoming India's Missile Man.",

highlights:[
"Inspirational journey",
"Dream big",
"Science and innovation",
"Leadership"
]

},

"The Power of Your Subconscious Mind":{

author:"Joseph Murphy",

genre:"Self Help",

published:"1963",

pages:"312",

description:"Explains how positive thinking and beliefs influence success and happiness.",

highlights:[
"Positive thinking",
"Self belief",
"Mental strength",
"Confidence"
]

},

"Think and Grow Rich":{

author:"Napoleon Hill",

genre:"Personal Finance",

published:"1937",

pages:"238",

description:"Classic personal development book about mindset and success principles.",

highlights:[
"Goal setting",
"Persistence",
"Success mindset",
"Decision making"
]

},

"The 7 Habits of Highly Effective People":{

author:"Stephen Covey",

genre:"Leadership",

published:"1989",

pages:"381",

description:"One of the world's most influential books on personal and professional effectiveness.",

highlights:[
"Be proactive",
"Begin with the end in mind",
"Put first things first",
"Think win-win"
]

}

};

let book = details[title];

if(!book){
    alert("Details not available.");
    return;
}

document.getElementById("popupTitle").innerHTML = title;

document.getElementById("popupBody").innerHTML = `
<p><b>Author:</b> ${book.author}</p>
<p><b>Genre:</b> ${book.genre}</p>
<p><b>Published:</b> ${book.published}</p>
<p><b>Pages:</b> ${book.pages}</p>

<h3>Description</h3>
<p>${book.description}</p>

<h3>Key Takeaways</h3>
<ul>
${book.highlights.map(item => `<li>${item}</li>`).join("")}
</ul>
`;

document.getElementById("detailsPopup").style.display = "flex";

}
//============== User Experience=======
let selectedExperienceBook = "";

function shareExperience(title){

selectedExperienceBook=title;

document.getElementById("experiencePopup").style.display="flex";

}
function closeExperience(){

document.getElementById("experiencePopup").style.display="none";

}

const textarea=document.getElementById("experienceMessage");

if(textarea){

textarea.addEventListener("input",()=>{

document.getElementById("count").innerHTML=

textarea.value.length;

});

}
//=========== Search Books==========

async function searchBooks(){

const keyword = document
.getElementById("searchInput")
.value
.toLowerCase();

const res = await fetch(`${API}/books`);

const books = await res.json();

const filtered = books.filter(book =>

book.title.toLowerCase().includes(keyword) ||

book.author.toLowerCase().includes(keyword)

);

const container = document.getElementById("shopContainer");

container.innerHTML="";

filtered.forEach(book=>{

container.innerHTML+=`

<div class="book-card">

<img src="./images/${book.image}">

<h3>${book.title}</h3>

<p>${book.author}</p>

<p>₹${book.price}</p>

<div class="btn-group">

<div class="btn-row">

<button onclick='addToCart(${JSON.stringify(book)})'>
🛒 Add To Cart
</button>

<button onclick='addToWishlist(${JSON.stringify(book)})'>
❤ Wishlist
</button>

</div>

<div class="btn-row">

<button onclick='openMessagePopup(${JSON.stringify(book)})'>
📩 Message Author
</button>

${getBookButton(book.title)}

</div>

</div>

</div>

`;

});

if(filtered.length===0){

container.innerHTML="<h2>No books found.</h2>";

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

//================Experience================
async function submitExperience(){

const message=document
.getElementById("experienceMessage")
.value;

if(message.length<20){

alert("Please write at least 20 characters.");

return;

}

const res=await fetch(`${API}/experience`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

userEmail:sessionStorage.getItem("email"),

bookTitle:selectedExperienceBook,

message

})

});

const data=await res.json();

if(data.success){

alert("Thank you for sharing your experience!");

closeExperience();

}

}

//=============== Reader Wall============

async function loadReaderWall(){

const container=document.getElementById("readerWallContainer");

if(!container) return;

container.innerHTML="";

const res=await fetch(`${API}/readerwall`);

const posts=await res.json();

posts.forEach(post=>{

container.innerHTML+=`

<div class="wall-card">

<h2>${post.bookTitle}</h2>

<p>

⭐ Verified Buyer

${post.userEmail}

</p>

<p>

"${post.message}"

</p>

</div>

`;

});

}

//============== Reader Wall=============
async function openReaderWall(title){

document.getElementById("readerWallPopup").style.display="flex";

document.getElementById("readerWallTitle").innerHTML=

title+" - Reader Wall";

const res=await fetch(`${API}/experience/${title}`);

const experiences=await res.json();

const container=document.getElementById("readerWallContainer");

container.innerHTML="";

if(experiences.length===0){

container.innerHTML=`

<h3>

No reader experiences yet.

Be the first!

</h3>

`;

return;

}

experiences.forEach(item=>{

container.innerHTML+=`

<div class="reader-card">

<h4>

Verified Buyer

</h4>

<p>

${item.message}

</p>

<small>

${item.userEmail}

</small>

</div>

`;

});

}

function closeReaderWall(){

document.getElementById("readerWallPopup").style.display="none";

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

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const totalAmount = cart.reduce((sum, book) => sum + Number(book.price), 0);

await fetch(`${API}/orders`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

userEmail: sessionStorage.getItem("email"),

books: cart,

totalAmount: totalAmount

})

});

localStorage.removeItem("cart");

window.location.href="success.html";

}

}


//================ ORDERS ================

async function loadOrders(){

const container=document.getElementById("ordersContainer");

if(!container) return;

container.innerHTML="";

const email=sessionStorage.getItem("email");

try{

const res=await fetch(`${API}/orders/${email}`);

const orders=await res.json();

if(orders.length===0){

container.innerHTML="<h2>No Orders Yet</h2>";

return;

}

orders.forEach(order=>{

order.books.forEach(book=>{

container.innerHTML+=`

<div class="order-card">

<img src="./images/${book.image}">

<h3>${book.title}</h3>

<p>Order Date :
${new Date(order.createdAt).toLocaleDateString()}</p>

<p>Status :
<span class="status delivered">
Delivered
</span></p>

<button onclick="shareExperience('${book.title}')">

⭐ Share Experience

</button>

</div>

`;

});

});

}

catch(err){

console.log(err);

}

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
