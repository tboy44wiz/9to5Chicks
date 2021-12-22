import multer from 'multer';
import path from 'path';
import Response from '../helpers/Response';

// var upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
 
var upload = multer({ 
  storage: storage,
  limits:{fileSize: 5000000} 
})

//upload.single('avatar')
var cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 }, { name: 'groupBanner', maxCount: 1 }
]);


const imageUploads = (req, res, next) => {
  cpUpload(req, res, (err) => {
    if (err) {
      const response = new Response(
        false,
        400,
        err.message,
      );
      return res.status(response.code).json(response);
    }
    return next();
  });
};

export default imageUploads;