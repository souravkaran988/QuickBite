const { upload } = require("../config/cloudinary");

// Single image upload — used for restaurant and menu item images
const uploadSingle = upload.single("image");

// Handle upload errors
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
      });
    }
    next();
  });
};

module.exports = { handleUpload };