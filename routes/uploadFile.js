const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const endpoints = require('../config/endpoints.json');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer to save files with the correct extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

const uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    const file = req.file;
    const validMimeTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type.' });
    }

    const formData = new FormData();
    formData.append('file_upload', fs.createReadStream(file.path));

    formData.getLength((err, length) => {
      if (err) {
        return res.status(500).json({ error: 'Error calculating form data length' });
      }

      const sendFileAssetToEndpoints = (index) => {
        if (index >= endpoints.fileAssetEndpoints.length) {
          return handleAssetCreation();
        }

        axios.post(endpoints.fileAssetEndpoints[index], formData, {
          headers: {
            ...formData.getHeaders(),
            'Content-Length': length
          }
        })
        .then(response => {
          if (index === 0) {
            req.fileUri = response.data.uri;
            req.fileExt = response.data.ext;
          }
          sendFileAssetToEndpoints(index + 1);
        })
        .catch(error => {
          console.error(`Error sending to file asset endpoint ${endpoints.fileAssetEndpoints[index]}:`, error.message);
          sendFileAssetToEndpoints(index + 1);
        });
      };

      const handleAssetCreation = () => {
        const assetData = {
          ext: req.fileExt,
          name: req.body.name,
          uri: req.fileUri,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          duration: parseInt(req.body.duration, 10),
          mimetype: file.mimetype,
          is_enabled: req.body.is_enabled === 'true',
          is_processing: true,
          nocache: false,
          play_order: 0,
          skip_asset_check: true
        };

        const sendAssetToEndpoints = (index) => {
          if (index >= endpoints.assetEndpoints.length) {
            fs.unlinkSync(file.path); // Clean up the uploaded file after successful upload
            return res.json({ message: 'File and asset created successfully', data: assetData });
          }

          axios.post(endpoints.assetEndpoints[index], assetData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(() => {
            sendAssetToEndpoints(index + 1);
          })
          .catch(error => {
            console.error(`Error sending to asset endpoint ${endpoints.assetEndpoints[index]}:`, error.message);
            sendAssetToEndpoints(index + 1);
          });
        };

        sendAssetToEndpoints(0);
      };

      sendFileAssetToEndpoints(0);
    });
  });
};

module.exports = uploadFile;
