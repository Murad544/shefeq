function sendSuccess(res, data, message = 'Success', statusCodeOrCode = 200, maybeCode = 'OK') {
  let statusCode = 200;
  let code = 'OK';

  if (typeof statusCodeOrCode === 'number') {
    statusCode = statusCodeOrCode;
    code = typeof maybeCode === 'string' ? maybeCode : 'OK';
  } else if (typeof statusCodeOrCode === 'string') {
    code = statusCodeOrCode;
    statusCode = typeof maybeCode === 'number' ? maybeCode : 200;
  }

  res.status(statusCode).json({
    success: true,
    code,
    message,
    data: data !== undefined ? data : null,
    timestamp: new Date().toISOString(),
  });
}

function sendError(res, message = 'Error', statusCode = 500, code = 'SERVER_ERROR') {
  res.status(statusCode).json({
    success: false,
    code,
    message,
    data: null,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { sendSuccess, sendError };
