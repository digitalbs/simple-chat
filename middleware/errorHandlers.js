'use strict';

exports.notFound = function notFound(req, res, next) {
  res.send(404, 'You seem lost. Go back to the beginning');
};

exports.error = function error(err, req, res, next) {
  console.error(err);
  res.send(500, 'Something Broke.');
};
