const fs = require('fs');
const path = require('path');
const endpointsPath = path.join(__dirname, '../config/endpoints.json');

const updateEndpoints = (req, res) => {
  const newEndpoints = req.body;
  fs.writeFile(endpointsPath, JSON.stringify(newEndpoints, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update endpoints' });
    }
    res.json({ message: 'Endpoints updated successfully' });
  });
};

module.exports = updateEndpoints;