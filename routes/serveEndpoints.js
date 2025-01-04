const endpoints = require('../config/endpoints.json');

const serveEndpoints = (req, res) => {
  res.json(endpoints);
};

module.exports = serveEndpoints;
