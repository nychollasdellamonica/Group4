const { home, homeLogin } = require("../controllers/homeController/homeController");
const { verifyUser} = require("../config/verifyUser")
const testDbController = require("../controllers/database/testDb"); 
const { dashboard } = require("../controllers/dashboardController/dashboardController"); // Correct import statement
const course = require("../controllers/coursesController/coursesController"); // Correct import statement
const { contact } = require("../controllers/contactControllers/contactController"); // Correct import statement
const { signin } = require("../controllers/signinControllers/signinController");
const lesson = require("../controllers/lessonControllers/lessonController")
const user = require("../controllers/userControllers/userController")
module.exports = (app) => {
    // Route for rendering the home page
    app.get('/', home); 

    // Route for rendering the contact page
    app.get('/contact', contact); 

    // Route for rendering the sign in page
    app.get('/signin', signin);

    // Route for rendering the login page
    app.get('/login', home);

    // Route for handling user login
    app.post('/login', verifyUser);
    app.get('/dashboard', dashboard);
    
    app.get('/course', course.courseGetData);
    app.post('/course', course.courseSaveData);
    app.get('/addCourse', course.addNewCourse);


    app.get('/lesson', lesson.getLessonReport); 
    app.post('/lesson', lesson.saveLessonData); 
    app.get('/addLesson', lesson.addLesson); 
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


    app.get('/usersReport', user.getUsersReport); 
    app.get('/addUser', user.addUser); 
    app.get('/editUser', user.getUserById); 
    app.post('/updateUser',user.saveUser)
};
