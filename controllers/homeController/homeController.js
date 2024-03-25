exports.home = async(req, res) =>{
    res.render('home',{title: "Home Page",errorLogin:""});   
}
exports.homeLogin = async(req, res) => {
    try {
        // Assuming you want to handle form submission logic here
        console.log(req.body) 
        const { email, password } = req.body;
    if (!email || !password) {
        res.render('home',{title: "Home Page",errorLogin:"Something went wrong!"})
    }

    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).send('Error handling form submission'); // Send an error message to the client
    }
}