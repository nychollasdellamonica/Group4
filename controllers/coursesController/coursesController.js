const oracledb = require('oracledb');
oracledb.autoCommit = true;
exports.courseGetData = async (req, res) => {
  if (req.session && req.session.user) { // check if the user is logged

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
        `select * from GP4_COURSE where id = :ID`
        , [req.query.id]
        , options = { fetchInfo: { "DESCRIPTION": { type: oracledb.STRING } } }
      );
      row = data.rows;
      if(row.length === 0){
        res.redirect('/');
        return
      }
      if (row[0].COVER_IMAGE) {
        row[0].COVER_IMAGE = row[0].COVER_IMAGE.toString('base64');
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
    res.render('courses', { title: "Courses Page", course: row[0], errorLogin: "" });
  } else {
    // User is not logged in, render login page
    res.redirect('/');
  }
}

exports.courseSaveData = async (req, res) => {
  if (req.session && req.session.user) {
    let courseData = req.body
    let id
    let bufferData
    if (courseData.coverImageBase64) {
      bufferData = Buffer.from(courseData.coverImageBase64, 'base64');
    }

    try {
      con = await oracledb.getConnection({
        user: process.env.NODE_ORACLEDB_USER,
        password: process.env.NODE_ORACLEDB_PASSWORD,
        connectionString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
        walletLocation: process.env.NODE_ORACLEDB_WALLET_LOCATION,
        externalAuth: false
      });
      // Prepare the procedure call
      const sql = `BEGIN GP4_COURSE_API.SAVE_GP4_COURSE(:p_id, :p_userId, :p_status, :p_code, :p_title, :p_description,
          :p_startDate, :p_endDate, :p_created, :p_createdBy, :p_updated,
          :p_updatedBy, :p_coverImage , :p_mimeType, :p_fileName); END;`;

      // Bind variables object
      const binds = {
        p_id: { dir: oracledb.BIND_INOUT, val: courseData.courseId },
        p_userId: { dir: oracledb.BIND_IN, val: req.session.user.ID },
        p_status: { dir: oracledb.BIND_IN, val: courseData.status ? courseData.status : 1 },
        p_code: { dir: oracledb.BIND_IN, val: courseData.code },
        p_title: { dir: oracledb.BIND_IN, val: courseData.title },
        p_description: { dir: oracledb.BIND_IN, val: courseData.description },
        p_startDate: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: courseData.startDate ? new Date(courseData.startDate) : null },
        p_endDate: { dir: oracledb.BIND_IN, val: courseData.endDate ? courseData.endDate : null },
        p_created: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: courseData.created ? courseData.created : new Date() },
        p_createdBy: { dir: oracledb.BIND_IN, val: courseData.createdBy ? courseData.createdBy : req.session.user.ID },
        p_updated: { dir: oracledb.BIND_IN, type: oracledb.DATE, val: new Date() },
        p_updatedBy: { dir: oracledb.BIND_IN, val: req.session.user.ID },
        p_coverImage: { dir: oracledb.BIND_IN, type: oracledb.BLOB, val: bufferData ? bufferData : null },
        p_mimeType: { dir: oracledb.BIND_IN, val: courseData.mimeType ? courseData.mimeType : null },
        p_fileName: { dir: oracledb.BIND_IN, val: courseData.coverImage ? courseData.coverImage : null }
      };

      // Execute the procedure call 
      const data = await con.execute(sql, binds);
      id = data.outBinds.p_id;
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
    res.redirect(`/course?id=${id}`);
  } else {
    // User is not logged in, render login page
    res.redirect('/');
  }
}

exports.addNewCourse = async (req, res) => {
  if (req.session && req.session.user) { // check if the user is logged
    res.render('courses', { title: "Courses Page", course: {}, errorLogin: "" });
  } else {
    // User is not logged in, render login page
    res.redirect('/');
  }
}