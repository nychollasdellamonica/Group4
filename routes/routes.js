const { home, homeLogin } = require("../controllers/homeController/homeController");
const { verifyUser} = require("../config/verifyUser")
const testDbController = require("../controllers/database/testDb"); 
const { dashboard } = require("../controllers/dashboardController/dashboardController"); // Correct import statement

module.exports = (app) => {
    // Route for rendering the home page
    app.get('/', home); 

    // Route for rendering the login page
    app.get('/login', home);

    // Route for handling user login
    app.post('/login', verifyUser);
    app.get('/dashboard', dashboard);
    
    // Route for handling user logout
    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/');
            }
        });
    });

    // Route for checking the database
    app.get('/testDb', (req, res) => {
        testDbController.checkDb(req, res);
    });
};
