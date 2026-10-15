function authorizeArticleAccess(req, res, next) {
  if (!req.user) {
    return res.status(401).send('Access denied. Authentication required.');
  }

  next();
}

module.exports = authorizeArticleAccess;
