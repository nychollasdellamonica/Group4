//imports
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');  

const app = express();
const PORT = process.env.PORT || 1337;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.set('view engine', 'ejs');

// Routes
require('./routes/routes')(app);

// Start server
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
