const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const uploadFile = require('./routes/uploadFile');
const serveIndex = require('./routes/serveIndex');

dotenv.config();

const app = express();
const port = 80;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload', uploadFile);
app.get('/', serveIndex);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
