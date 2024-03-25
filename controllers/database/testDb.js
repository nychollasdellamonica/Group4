const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

exports.checkDb = async (req, res) => {
  let con;
  try{
    con = await oracledb.getConnection({
      user: process.env.NODE_ORACLEDB_USER,
      password: process.env.NODE_ORACLEDB_PASSWORD,
      connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
      walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
      externalAuth: false // Set this to true if you're using External Authentication
    });
    const data = await con.execute(
      `select 'alive' as isAlive from dual`
      ,
    );
    console.log(data);
    // const jsonData = JSON.stringify(data.rows, null, 2);
    res.setHeader('Content-Type', 'text/plain');
    res.json(data.rows[0].ISALIVE); 
  } catch (err) {
    console.error(err);
    res.json(); 
  } finally {
    if (con) {
      try {
        await con.close();
      } catch (err) {
        console.error(err);
        res.json(); 
      }
    }
  }
};
