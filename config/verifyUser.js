const oracledb = require('oracledb');

exports.verifyUser = async (req, res) => {
    try {
        // Assuming you want to handle form submission logic here
        console.log(req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('home', { title: "Home Page", errorLogin: "Something went wrong!" });
        }
        let e =  email.toUpperCase();
        console.log(e)
        try {
            const connection = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false // Set this to true if you're using External Authentication
            });

            const result = await connection.execute(
                `SELECT * FROM gp4_users WHERE UPPER(username) = :user_name AND password = :pwd`,
                { user_name: e, pwd: password }
            );

            if (result.rows.length > 0) {
                // User authentication successful, set session
                console.log(result.rows[0])
                req.session.userID = result.rows[0].ID;
                req.session.user = result.rows[0].USERNAME;
                return res.redirect('/dashboard')
            } else {
                return res.render('home', { title: "Home Page", errorLogin: "Invalid email or password." });
            }
        } catch (error) {
            console.error(error);
            return res.render('home', { title: "Home Page", errorLogin: "Something went wrong!" });
        }

    } catch (error) {
        console.error('Error handling form submission:', error);
        return res.status(500).send('Error handling form submission'); // Send an error message to the client
    }
};
