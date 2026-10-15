function logRequests(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} request to ${req.originalUrl}`);
  next();
}

module.exports = logRequests;
