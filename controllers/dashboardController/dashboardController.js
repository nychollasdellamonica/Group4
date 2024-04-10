const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsBuffer = [ oracledb.BLOB ];

const fs = require('fs');
const path = require('path'); 
exports.dashboard = async (req, res) => {
    if (req.session && req.session.user) { // check if the user is logged
        let itens
        try{
            con = await oracledb.getConnection({
              user: process.env.NODE_ORACLEDB_USER,
              password: process.env.NODE_ORACLEDB_PASSWORD,
              connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
              walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
              externalAuth: false 
            });
            const data = await con.execute(
              `select c.*
                      ,case when e.id is not null then 'Y' else 'N' end enrolled
              from GP4_COURSE c
                  ,GP4_ENROLLMENTS e
                  where c.id = e.courseid(+)
              `
              ,[]
              ,options = {fetchInfo: {"DESCRIPTION": { type: oracledb.STRING } }}
            );
            itens = data.rows;
            for(let i=0; i< itens.length; i++){
              if(itens[i].COVER_IMAGE){
                itens[i].COVER_IMAGE = itens[i].COVER_IMAGE.toString('base64');
              }else{
                const imagePath = path.resolve(__dirname, '..','..', 'images', 'ai.jpg');
                const imageData = fs.readFileSync(imagePath);
                const base64Image = Buffer.from(imageData).toString('base64');
                itens[0].COVER_IMAGE =base64Image
              }
            }

            
             
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
        res.render('dashboard', { title: "Dashboard",courses:itens});
    } else {
        // User is not logged in, render login page
        res.redirect('/');
    }
}

;