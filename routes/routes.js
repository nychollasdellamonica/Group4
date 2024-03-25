const { home,homeLogin } = require("../controllers/homeController/homeController");
const testDbController = require("../controllers/database/testDb");
module.exports = (app) =>{
    app.get('/',home); 
    app.post('/',(req, res, next) => homeLogin(req, res, next))

    app.get('/testDb', (req, res) => {
        testDbController.checkDb(req, res)
    });
}