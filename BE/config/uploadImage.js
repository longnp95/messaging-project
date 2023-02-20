const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file && file.fieldname === 'images' && file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileSize = 5 * 1024 * 1024;

const upload = multer({ storage: fileStorage, limits: { fileSize: fileSize }, fileFilter: fileFilter }).array('images');

module.exports = upload;