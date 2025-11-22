function notFound(req, res, next) {
  res.status(404).json({ success: false, message: 'Resource not found' });
}
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
}
module.exports = { notFound, errorHandler };
