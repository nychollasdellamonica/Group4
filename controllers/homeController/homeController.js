exports.home = async (req, res) => {
    res.render('home', { title: "Home Page", errorLogin: "" });
}