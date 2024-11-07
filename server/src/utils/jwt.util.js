const jwt = require("jsonwebtoken");
const generateToken = (id, secret, expiresIn) => {
  const token = jwt.sign({ id }, secret, { expiresIn });
  return token;
};

const verifyToken = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

module.exports = { generateToken, verifyToken };
