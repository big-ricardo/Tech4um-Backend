const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

module.exports = {
  createToken(user) {
    const token = jwt.sign({ user }, SECRET, {
      expiresIn: "1d",
    });

    return token;
  },

  validateToken(token, res) {
    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, userData) => {
        if (err) {
          return res.status(401).json({ error: "Token invalid" });
        }

        return userData.user;
      }
    );

    return decoded;
  },
};
