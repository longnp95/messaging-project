const multer = require('multer');
const upload = require('../config/upload');

module.exports = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      // A Multer error occurred when uploading.
      return res.status(200).json({
        error: {
          status: 500,
          message: `Multer uploading error: ${err.message}`
        },
        data: {}
      });
    } else if (err) {
      // An unknown error occurred when uploading.
      if (err.name == 'ExtensionError') {
        return res.status(200).json({
          error: {
            status: 413,
            message: err.message
          },
          data: {}
        });
      } else {
        return res.status(200).json({
          error: {
            status: 500,
            message: `Unknown uploading error: ${err.message}`
          },
          data: {}
        });
      }
    }

    const file = req.files;

    if (!file || file.length < 1) {
      return res.status(200).json({
        error: {
          status: 401,
          message: 'Must upload file!'
        },
        data: {}
      });
    }

    next();
  });
}