const jwt = require("jsonwebtoken");
const { publicKey } = require("../config/jwt");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, payload) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = payload; // payload = lo que auth-service firmó
    next();
  });
}

module.exports = authenticate;
