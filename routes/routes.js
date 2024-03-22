// const express = require("express");
// const router = express.Router();
// const test = require('../controllers/database/testOraDb'); 



// router.get("/",(req, res) =>{
//     res.render('home',{title: "Home Page"});
// })
// router.get("/test",(req, res) =>{
//     res.send(test.findAll())
// })
// module.exports = router; 
const { home } = require("../controllers/homeController/homeController");
const testDbController = require("../controllers/database/testDb");
module.exports = (app) =>{
    app.get('/',home);
    app.get('/testDb', (req, res) => {
        testDbController.checkDb(req, res)
    });
}