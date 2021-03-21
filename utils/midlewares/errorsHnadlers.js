const boom = require("@hapi/boom");
const { config } = require("../../config");
const isRequestAjaxOrApi = require("../../utils/isRequestAjaxOrApi");

function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack };
  }
}

function LogErrors(err, req, res, next) {
  console.log(err.stack);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }
  next(err);
}

function clientErrorHnadler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;

  //catch errors for AJAX request or if an error ocurrs while streming
  if (isRequestAjaxOrApi(req) || req.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;

  res.status(statusCode || 500);
  res.render("error", withErrorStack(payload, err.stack));
}

module.exports = {
  clientErrorHnadler,
  errorHandler,
  LogErrors,
  wrapErrors,
};
