const path = require('path');

const serveIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
};

module.exports = serveIndex;
