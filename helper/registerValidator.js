const emailValidator = require("./emailValidator");
const passwordValidator = require("./passwordValidator");
const query = require("../database");

const registerValidator = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (username.length < 6) {
    return res.status(401).send("Username harus 6 karakter atau lebih");
  }
  if (!emailValidator(email)) {
    return res.status(401).send("Format email salah");
  }
  if (!passwordValidator(password)) {
    return res
      .status(401)
      .send(
        "Password harus lebih dari 6 karakter, mengandung angka dan karakter spesial"
      );
  }
  try {
    const isAvail = await query(
      `SELECT id, uid, role FROM users WHERE email = '${email}' OR username = '${username}'`
    );
    if (isAvail.length > 0) {
      return res.status(401).send("Email atau username sudah terdaftar");
    }
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = registerValidator;
