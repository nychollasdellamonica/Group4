exports.contact = async (req, res) => {
    res.render('contact', { title: "Contact Page", errorLogin: "" });
}