const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const uploadFile = require('./routes/uploadFile');
const serveIndex = require('./routes/serveIndex');
const serveEndpoints = require('./routes/serveEndpoints');
const updateEndpoints = require('./routes/updateEndpoints');

dotenv.config();

const app = express();
const port = 80;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload', uploadFile);
app.get('/', serveIndex);
app.get('/endpoints', serveEndpoints);
app.post('/update-endpoints', updateEndpoints);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
