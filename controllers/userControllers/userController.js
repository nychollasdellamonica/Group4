const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsBuffer = [oracledb.BLOB];

exports.getUsersReport = async (req, res) => {
    if (req.session && req.session.user) { // check if the user is logged
        let itens
        try {
            con = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false
            });
            const data = await con.execute(
                `select 
                ID
                ,case when STATUS = 1 then 'Admin' else 'Student' end STATUS
                ,USERNAME
                ,PASSWORD
                ,EMAIL
                ,FIRST_NAME
                ,LAST_NAME
                ,PHONE
                ,START_DATE
                ,END_DATE
                ,CREATED
                ,CREATED_BY
                ,UPDATED
                ,UPDATED_BY
                ,VALUE_B
                ,VALUE_C                
                from GP4_USERS`
                , []
            );
            itens = data.rows;


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
        res.render('usersReport', { title: "Users report", user: itens });
    } else {
        // User is not logged in, render login page
        res.redirect('/');
    }
}



exports.getUserById = async (req, res) => {
    if (req.session && req.session.user) { // check if the user is logged
        let itens
        try {
            con = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false
            });
            const data = await con.execute(
                `select
                ID
                ,case when STATUS = 1 then 'Admin' else 'Student' end STATUS
                ,USERNAME
                ,PASSWORD
                ,EMAIL
                ,FIRST_NAME
                ,LAST_NAME
                ,PHONE
                ,START_DATE
                ,END_DATE
                ,CREATED
                ,CREATED_BY
                ,UPDATED
                ,UPDATED_BY
                ,VALUE_B
                ,VALUE_C     from GP4_USERS where id =:id`
                , [req.query.id]
            );
            itens = data.rows;


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
        res.render('user', { title: "User", user: itens[0] });
    } else {
        // User is not logged in, render login page
        res.redirect('/');
    }
}

exports.addUser = async (req, res) => {
    let items
    if (req.session && req.session.user) { // check if the user is logged
        res.render('user', { title: "Users report", user: items })
    } else {
        res.redirect('/');

    }
}
exports.saveUser = async (req, res) => {
    if (req.session && req.session.user) {
        let l_data = req.body

        try {
            con = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false
            });
            let binds = {
                        //  id: { dir: oracledb.BIND_IN, val: l_data.id },
                        status: { dir: oracledb.BIND_IN, type: oracledb.NUMBER,val:1},
                        username:  { dir: oracledb.BIND_IN,type: oracledb.STRING, val:l_data.username},
                        password:{ dir: oracledb.BIND_IN, type: oracledb.STRING,val:l_data.password},
                        email:{ dir: oracledb.BIND_IN, type: oracledb.STRING,val:l_data.email},
                        first_name:{ dir: oracledb.BIND_IN, type: oracledb.STRING,val:l_data.firstName},
                        last_name:{ dir: oracledb.BIND_IN, type: oracledb.STRING,val:l_data.lastName},
                        phone:{ dir: oracledb.BIND_IN, type: oracledb.STRING,val:l_data.phone},
                        start_date:{ dir: oracledb.BIND_IN,type: oracledb.DATE, val: l_data.startDate ? new Date(l_data.startDate) : new Date()},
                        end_date:{ dir: oracledb.BIND_IN, type: oracledb.DATE,val: l_data.endDate ? new Date(l_data.endDate) : null },
                        

                idRET: { dir: oracledb.BIND_OUT, type:oracledb.NUMBER, val: l_data.userId },
            }
            if (l_data.userId) {
                binds = {
                    ...binds, // Spread the existing binds object
                    id: { dir: oracledb.BIND_IN, val: l_data.userId }
                };
                const data = await con.execute(
                    `update GP4_USERS set   STATUS = :status
                                            ,USERNAME = :username
                                            ,PASSWORD = :password
                                            ,EMAIL      = :email
                                            ,FIRST_NAME = :first_name
                                            ,LAST_NAME  = :last_name
                                            ,PHONE      = :phone
                                            ,START_DATE = :start_date
                                            ,END_DATE = :end_date
                                            where id = :id
                                     returning id into :idRET`
                    , binds
                );
                id = data.outBinds.idRET;
            } else {
                const data = await con.execute(
                    `insert into GP4_USERS(STATUS
                                          ,USERNAME
                                          ,PASSWORD
                                          ,EMAIL
                                          ,FIRST_NAME
                                          ,LAST_NAME
                                          ,PHONE
                                          ,START_DATE
                                          ,END_DATE
                                        ) VALUES(
                                            :status
                                            ,:username
                                            ,:password
                                            ,:email
                                            ,:first_name
                                            ,:last_name
                                            ,:phone
                                            ,:start_date
                                            ,:end_date) returning id into :idRET`
                    , binds
                );

                row = data.rows;
                id = data.outBinds.idRET;
            }

        } catch (err) {
            console.error(err); 
        } finally {
            if (con) {
                try {
                    await con.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
        res.redirect('/usersReport')

    } else {
        res.redirect('/');

    }
}
    ;