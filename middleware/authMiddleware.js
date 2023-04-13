const jwt = require("jsonwebtoken");
const config = process.env;
const auth = (req, res, next) => {
  const token = req.header["x-auth-token"] || req.body.token || req.query.token;
  if (!token) {
    return res.status(403).send("A token is required");
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(401).send("Invalid token" + err);
  }
  return next();
};
module.exports = auth;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJ1c2VyX2lkIjoiNjQzNzMyMDNmOTQ2ODcxODBhNzUxMjZkIiwiZW1haWwiOiJwcmFiYWxqYWlubkBnbWFpbC5jb20iLCJpYXQiOjE2ODE0MDMzOTAsImV4cCI6MTY4MTQwMzQ1MH0
//   .PCr4qIbDZxSgdc8k - Vm4QSFh0ELJOWyeHwh3js_YyAA;
