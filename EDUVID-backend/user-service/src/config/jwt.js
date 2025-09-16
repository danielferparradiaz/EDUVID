const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(path.join(__dirname, "../../public.pem"), "utf8");

module.exports = {
  publicKey
};
