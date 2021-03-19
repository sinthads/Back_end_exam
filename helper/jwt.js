const jwt = require("jsonwebtoken");

const createJWTToken = (payload) => {
  return jwt.sign(payload, "secretkey", {
    expiresIn: "12h",
  });
};
const checkToken = (req, res, next) => {
  if (req.method !== "OPTIONS") {
    jwt.verify(req.body.token, "secretkey", (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: err.message,
          status: "Unauthorized",
        });
      }
      req.user = decoded;
      next();
    });
  }
};

module.exports = {
  createJWTToken,
  checkToken,
};
