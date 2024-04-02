exports.home = async (req, res) => {
    if (req.session && req.session.user){
        res.redirect('/dashboard');
    }else{
        res.render('home', { title: "Home Page", errorLogin: "" });
    }
    
}