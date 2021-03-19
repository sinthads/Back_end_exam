const router = require("express").Router();
const query = require("../database");
const { checkToken } = require("../helper");

router.get("/get/all", async (req, res) => {
  try {
    const response = await query(
      `SELECT
        m.name,
        m.release_date,
        m.release_month,
        m.release_year,
        m.duration_min,
        m.genre,
        m.description,
        ms.status,
        l.location,
        st.time
        FROM schedules s
        JOIN movies m ON m.id = s.movie_id
        JOIN locations l ON l.id = s.location_id
        JOIN show_times st ON st.id = s.time_id
        JOIN movie_status ms ON ms.id = m.status;`
    );
    return res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/get", async (req, res) => {
  const { status, location, time } = req.query;
  try {
    let sql = `SELECT
        m.name,
        m.release_date,
        m.release_month,
        m.release_year,
        m.duration_min,
        m.genre,
        m.description,
        ms.status,
        l.location,
        st.time
        FROM schedules s
        JOIN movies m ON m.id = s.movie_id
        JOIN locations l ON l.id = s.location_id
        JOIN show_times st ON st.id = s.time_id
        JOIN movie_status ms ON ms.id = m.status WHERE`;
    if (status && location && time) {
      sql += ` ms.status = '${status}' AND l.location = '${location}' AND st.time = '${time}'`;
    } else if (status) {
      sql += ` ms.status = '${status}'`;
    } else if (location) {
      sql += ` l.location = '${location}'`;
    } else if (time) {
      sql += ` st.time = '${time}'`;
    }
    const response = await query(sql);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/add", checkToken, async (req, res) => {
  console.log(req.user.role);
  delete req.body.token;
  console.log(req.user);
  if (req.user.role === 2) {
    return res.status(401).send("user is not authorized");
  }
  try {
    const { insertId } = await query(`INSERT INTO movies SET ?`, req.body);
    const response = await query(`SELECT * FROM movies WHERE id = ${insertId}`);
    return res.status(200).send(response[0]);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
