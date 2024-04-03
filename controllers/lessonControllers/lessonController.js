const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
exports.getLessonReport = async (req, res) => {
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
                `select * from GP4_LEASONS where COURSEID = :courseid
                order by sort_num`
                , [req.query.courseId]
                , options = { fetchInfo: { "DESCRIPTION": { type: oracledb.STRING } } }
            );
            row = data.rows; 

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
        res.render('lessonReport', { title: "Lessons", lessons: row, errorLogin: "", courseId: req.query.courseId });
    }else if(req.session && req.session.user && req.query.id ){
        try {
            con = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false
            });
            const data = await con.execute( 
                `select * from GP4_LEASONS where id = :id`
                , [req.query.id]
                , options = { fetchInfo: { "CONTENT": { type: oracledb.STRING } } }
            );
            row = data.rows; 

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
        res.render('lesson', { title: "Lesson Form", errorLogin: "", courseId: req.query.courseId,lesson:row[0] });
    }
    
      
}

exports.saveLessonData = async (req, res) => {
    let id
    if (req.session && req.session.user) {
        let row

        let l_data = req.body 

        try {
            con = await oracledb.getConnection({
                user: process.env.NODE_ORACLEDB_USER,
                password: process.env.NODE_ORACLEDB_PASSWORD,
                connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
                walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
                externalAuth: false
            });
            const binds = {
                courseid: { dir: oracledb.BIND_IN, val: l_data.courseID },
                title: { dir: oracledb.BIND_IN, val: l_data.lessonName },
                sort_number: { dir: oracledb.BIND_IN, val: l_data.sortNumber },
                content: { dir: oracledb.BIND_IN, type: oracledb.CLOB, val: l_data.lessonContent },
                idRET: { dir: oracledb.BIND_OUT, val: l_data.ID },
                id: { dir: oracledb.BIND_IN, val: l_data.ID }
            }
            if (l_data.ID){
                const data = await con.execute(
                    `update   gp4_leasons set COURSEID = :courseid
                                ,TITLE = :title
                                ,CONTENT = :content
                                ,SORT_NUM = :sort_number
                                where id = :id
                                 returning id into :idRET`
                    , binds
                ); 
                id = data.outBinds.idRET;
            }else{
            const data = await con.execute(
                `insert into gp4_leasons(COURSEID,TITLE,CONTENT,SORT_NUM) VALUES(:courseid,:title,:content,:sort_number) returning id into :idRET`
                , binds
            );

            row = data.rows; 
            id = data.outBinds.idRET;
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
        res.redirect(`/lesson?id=${id}`);
    } else {
        res.redirect(`/`);
    }
}

exports.addLesson = async (req, res) => {
    if (req.session && req.session.user) {
    res.render('lesson', { title: "Lesson Form", errorLogin: "", courseId: req.query.courseId, lesson: {} });
    }else{
        res.redirect("/")
    }
} 
