function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${new Date().toISOString()} -`, err.stack || err.message || err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).send(`Error: ${message}`);
}

function notFoundHandler(req, res) {
  res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
}

module.exports = { errorHandler, notFoundHandler };
