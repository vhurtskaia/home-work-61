function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Access denied. No credentials sent.');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res
      .status(401)
      .send('Access denied. Expected header format: Authorization: Bearer <token>');
  }

  req.user = { id: token, token };
  next();
}

module.exports = authenticate;
