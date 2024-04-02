const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
exports.getLessonData = async (req, res) => {
    if (req.session && req.session.user && req.query.courseId) {
        let row
        try {
            con = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false
            });
            const data = await con.execute(
                `select * from GP4_LEASONS where COURSEID = :courseid`
                , [req.query.courseId]
                , options = { fetchInfo: { "DESCRIPTION": { type: oracledb.STRING } } }
            );
            row = data.rows; 
                console.log(row)

        } catch (err) {
            console.error(err);
            res.json();
        } finally {
            if (con) {
                try {
                    await con.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
        res.render('lessonReport', { title: "Lessons",lessons : row, errorLogin: "" });
    }else{
        res.render('lesson', { title: "Lesson Form", errorLogin: "" });
    }
}
