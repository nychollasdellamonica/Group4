exports.dashboard = async (req, res) => {
    if (req.session && req.session.user) {
        // User is logged in, render home page
        res.render('dashboard', { title: "Dashboard"});
    } else {
        // User is not logged in, render login page
        res.redirect('/');
    }
};