const router = require("express").Router();
const query = require("../database");
const {
  createJWTToken,
  emailValidator,
  registerValidator,
  checkToken,
} = require("../helper");

router.post("/register", registerValidator, async (req, res) => {
  const { username, email, password } = req.body;
  const uid = new Date().getTime();
  try {
    const registerDb = await query(
      `INSERT INTO users (uid, username, email, password) VALUES (${uid}, '${username}', '${email}', '${password}')`
    );
    const getRegisteredData = await query(
      `SELECT * FROM users WHERE id = ${registerDb.insertId}`
    );
    const token = createJWTToken({
      uid: getRegisteredData[0].uid,
      role: getRegisteredData[0].role,
    });
    return res.status(200).send({ ...getRegisteredData[0], token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { user, password } = req.body;
  let loginData;
  try {
    if (emailValidator(user)) {
      loginData = await query(
        `SELECT id, uid, username, email, role, status FROM users WHERE email = '${user}' and password = '${password}'`
      );
    } else {
      loginData = await query(
        `SELECT id, uid, username, email, role, status FROM users WHERE username = '${user}' and password = '${password}'`
      );
    }
    const token = createJWTToken({
      uid: loginData[0].uid,
      role: loginData[0].role,
    });
    res.status(200).send({ ...loginData[0], token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/deactivate", checkToken, async (req, res) => {
  try {
    await query(`UPDATE users SET status = 2 WHERE uid = ${req.user.uid}`);
    const response = await query(
      `SELECT u.uid, s.status FROM users u JOIN status s ON s.id = u.status WHERE uid = ${req.user.uid}`
    );
    res.status(200).send(response[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/activate", checkToken, async (req, res) => {
  try {
    const user = await query(`SELECT * FROM users WHERE uid = ${req.user.uid}`);
    if (user[0].status === 2) {
      await query(`UPDATE users SET status = 1 WHERE uid = ${user[0].uid}`);
      const response = await query(
        `SELECT u.uid, s.status FROM users u JOIN status s ON s.id = u.status WHERE u.uid = ${user[0].uid}`
      );
      res.status(200).send({
        uid: response[0].uid,
        status: response[0].status,
      });
    } else {
      return res.status(401).send("Akun tidak dapat diaktifkan");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/close", checkToken, async (req, res) => {
  try {
    await query(`UPDATE users SET status = 3 where uid = ${req.user.uid}`);
    const response = await query(
      `SELECT u.uid, s.status FROM users u JOIN status s ON s.id = u.status WHERE u.uid = ${req.user.uid}`
    );
    res.status(200).send({
      uid: response[0].uid,
      status: response[0].status,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
