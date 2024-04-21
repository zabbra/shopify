const multer = require('multer');

// Configuration de multer pour le stockage des images des catégories
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.').pop(); // Extraire l'extension du fichier
    cb(null, 'category-' + Date.now() + '.' + extension); // Nom du fichier avec extension
  }
});



  
  const upload = multer({ storage: storage });
  
  module.exports = upload;