const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";

module.exports = {
  createToken(user) {
    const token = jwt.sign({ user }, SECRET, {
      expiresIn: "1d",
    });

    return token;
  },

  validateToken(token, res = null) {
    if (!token) {
      if (res) {
        return res.status(401).json({ error: "Token is required" });
      }
     return null;
    }

    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      SECRET,
      (err, userData) => {
        if (err) {
          if (res){
            return res.status(401).json({ error: "Token invalid" });
          }
          return null;
        }

        return userData.user;
      }
    );

    return decoded;
  },
};
