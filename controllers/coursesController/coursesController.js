exports.courses = async (req, res) => {
    res.render('courses', { title: "Courses Page", errorLogin: "" });
}