const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, 'userId.' + req.userId + '-' + file.mimetype.split('/')[0] + '.' + file.mimetype.split('/')[1] + '-' + Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file && file.fieldname === 'files') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileSize = 5 * 1024 * 1024;

const upload = multer({ storage: fileStorage, limits: { fileSize: fileSize }, fileFilter: fileFilter }).array('files');

module.exports = upload;