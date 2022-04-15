const jwt = require("jsonwebtoken");
const { user: User } = require("../models/index");

module.exports = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.user = null;
    return next();
  }
  const decoded = jwt.verify(token, "mysecret");
  if (decoded) {
    const user = await User.findOne({ where: { id: decoded.id } });
    req.user = user.dataValues;
    next();
  } else {
    req.user = null;
    next();
  }
};
