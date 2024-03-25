const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
exports.dashboard = async (req, res) => {
    if (req.session && req.session.user) {
        console.log(`USER: ${req.session.user}`)
        let courses
        try{
            con = await oracledb.getConnection({
              user: process.env.NODE_ORACLEDB_USER,
              password: process.env.NODE_ORACLEDB_PASSWORD,
              connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
              walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
              externalAuth: false 
            });
            const data = await con.execute(
              `select * from GP4_COURSE`
              ,
            );
            // console.log(data);
            courses = data.rows;
             
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
         
        res.render('dashboard', { title: "Dashboard",courses:courses});
    } else {
        // User is not logged in, render login page
        res.redirect('/');
    }
}

;