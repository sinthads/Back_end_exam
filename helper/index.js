const { createJWTToken, checkToken } = require("./jwt");
const emailValidator = require("./emailValidator");
const passwordValidator = require("./passwordValidator");
const registerValidator = require("./registerValidator");

module.exports = {
  createJWTToken,
  checkToken,
  emailValidator,
  passwordValidator,
  registerValidator,
};
