//imports
require('dotenv').config();
const express = require('express')
const session = require('express-session')
const app = express()
const PORT = process.env.PORT || 1337;

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(session({
    secret: "secret goes here",
    saveUninitialized: true,
    resave: false,
}))

app.set('view engine', "ejs");

//
require('./routes/routes')(app);

app.listen(PORT,()=>{
    console.log(`Server running: http://localhost:${PORT}`)
})