function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

function sendError(res, message = 'Error', statusCode = 500) {
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { sendSuccess, sendError };
