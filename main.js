//imports
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');  

const app = express();
const PORT = process.env.PORT || 1337;
 
// Middlewares 
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb'  }));
app.use(express.json({ limit: '20mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
})); 

// 
app.use(express.static("./public"));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.set('view engine', 'ejs');

// Routes
require('./routes/routes')(app);

//Husna 
app.post('/send-contact-form', (req, res) => {
    // Extract the data from req.body
    const { name, email, message } = req.body;
    
    // TODO: Add your logic to handle the form submission,
    // such as sending an email or saving the information in a database.
    
    // For now, just send a simple response
    res.send("Thank you for contacting us, " + name + "!");
});

app.get('/forgot-password', (req, res) => {
    // Render a password recovery or reset page here
    // res.render('forgot-password');
});

app.post('/login', (req, res) => {
    // Extract the data from req.body
    const { role, username, password } = req.body;
    
    // TODO: Add your authentication logic here, taking into account the role
    // This might involve looking up the user in different databases or tables depending on the role

    // If authentication is successful
    // Redirect the user to the appropriate dashboard
    // if (role === 'student') {
    //     res.redirect('/student-dashboard');
    // } else if (role === 'educator') {
    //     res.redirect('/educator-dashboard');
    // }
    
    // If authentication fails
    // res.redirect('/signin');
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
