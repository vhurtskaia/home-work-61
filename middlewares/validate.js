function validateUserInput(req, res, next) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).send('Missing required fields: username and password');
  }

  next();
}

function validateUserId(req, res, next) {
  const { userId } = req.params;

  if (!userId || !/^[0-9]+$/.test(userId)) {
    return res.status(400).send('Invalid userId parameter: must be numeric');
  }

  next();
}

function validateArticleId(req, res, next) {
  const { articleId } = req.params;

  if (!articleId || !/^[0-9]+$/.test(articleId)) {
    return res.status(400).send('Invalid articleId parameter: must be numeric');
  }

  next();
}

function validateArticleInput(req, res, next) {
  const { title, content } = req.body || {};

  if (!title || !content) {
    return res.status(400).send('Missing required fields: title and content');
  }

  next();
}

module.exports = {
  validateUserInput,
  validateUserId,
  validateArticleId,
  validateArticleInput,
};
