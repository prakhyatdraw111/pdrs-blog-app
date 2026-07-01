require("dotenv").config(); // for the .env file to work

const express = require("express");

const expressLayouts = require("express-ejs-layouts");

const {getDoc, getFirestore, doc, onSnapshot} = require("firebase/firestore");

const app = express();

app.use(expressLayouts);

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

app.set("layout", "./layouts/main");

app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

// comment every line starts here

const docRef = doc(getFirestore(connectDB), "logIn", "logIn"); 

onSnapshot(docRef, (docSnap) => { 
    // arrow function for real time updates for logged in status

    app.locals.loggedIn = docSnap.data()["logIn"]; // to set global locals for the template "header.ejs"

});


app.listen(process.env.PORT, () => {

    console.log(`Server is running on port ${process.env.PORT}`);           

});
