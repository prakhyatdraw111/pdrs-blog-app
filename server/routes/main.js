const express = require("express");

const connectDB = require("../config/db");

const {doc, getDoc, getDocs, Timestamp, 
    query, collection, where, getFirestore, DocumentReference,
    updateDoc, addDoc, onSnapshot} = require("firebase/firestore");

const router = express.Router();

async function getLatestPosts()
{
    let fiveDaysAgo = new Date(Date.now() - 1000 * 3600 * 24 * 5);

    const q = query(collection(getFirestore(connectDB), "blogs"), where("postDate", ">=", Timestamp.fromDate(fiveDaysAgo)));

    const docs = await getDocs(q);

    return docs;
}

async function getAllDocs()
{
    const docs = await getDocs(collection(getFirestore(connectDB), "blogs"));

    return docs;
}

async function updateLogIn(bool)
{
    const docRef = doc(getFirestore(connectDB), "logIn", "logIn"); // create document reference to be updated

    await updateDoc(docRef, {logIn: bool});
}

async function addBlog(req)
{
    await addDoc(collection(getFirestore(connectDB), "blogs"), {
        blogTitle: req.body.blogTitle,
        blog: req.body.blog,
        postDate: Timestamp.fromDate(new Date())
    });
}

getLatestPosts().then( listOfDocs => {
 
    router.get("/", (req, res) => {

        const locals = {
            title: "Pdr's Blog App",
            description: "Simple blog app built with Node.js, Express & EJS"
        }

        res.render("index.ejs", { locals, listOfDocs });

    });

});

getAllDocs().then((listOfAllDocs) => {

    router.get("/blog", (req, res) => {

        res.render("blogNo.ejs", {listOfAllDocs});

    });

    listOfAllDocs.forEach( document => {

        router.get(`/blog/${document.id}`, (req, res) => {

            res.render("blog.ejs", {document});

        });

    });

    router.use((req, res, next) => {

        res.status(404).render("404.ejs");

    });

});

router.get("/about", (req, res) => {

    const locals = {

        title: "About Pdr's Blog App"

    }

    res.render("about.ejs", { locals });

});

router.post("/search", (req, res) => {

    const searchQuery = req.body.q;

    getAllDocs().then(listOfDocs => {

        let filteredDocs = [];

        listOfDocs.forEach(doc => {

            if (doc.data()["blogTitle"].includes(searchQuery))
            {
                filteredDocs.push(doc);
            }

        });

        res.render("search.ejs", {searchQuery, filteredDocs});

    });
    
});

router.get("/login", (req, res) => {

    let loginText = "";

    res.render("loginPage.ejs", {loginText});

});

router.post("/login", (req, res) => {

    let storedPassword = req.body.password;

    let loginText = "Incorrect password";

    if (storedPassword === "testPass")
    {
        updateLogIn(true).then(() => {

            res.redirect("/");

        });
    }
    else
    {
        res.render("loginPage.ejs", {loginText});
    }

});

router.get("/logout", (req, res) => {

    updateLogIn(false).then(() => {

        res.redirect("/");

    });
    
});

router.get("/createpost", (req, res) => {

    res.render("createPost.ejs", {submitText: ""});

});

router.post("/createpost", (req, res) => {

    addBlog(req).then(() => {

        res.render("createPost.ejs", {submitText: "Blog submitted successfully"});

    });
});

module.exports = router;