const util = require("util");
const multer = require("multer");
const path = require('path');

const maxSize = 2 * 1024 * 1024; // 2Mo

const imageFilter = (req,file,cb) =>{
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType =  fileTypes.test(file.mimetype) && file.mimetype.startsWith("image");
    const extname = fileTypes.test(path.extname(file.originalname))
    if(!mimeType || !extname){
        cb(" Please give proper files formate to upload only images",false)  
    }
    cb(null,true)
    
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __basedir + "/resources/static/assets/uploads/") // Spécifiez le dossier où vous souhaitez stocker les images
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop(); // Extraire l'extension du fichier
        cb(null, `${Date.now()}-shopify-${file.originalname}`) // Génère un nom de fichier unique avec extension pour nous assurer que les doublons ne se produisent jamais:  Date.now() + '.' + extension
    }
});

const uploadFile = multer({ 
    storage: storage,
    limits:{fileSize:'1000000'}, 
    //fileFilter:imageFilter
    
});
//let uploadFileMiddleware = util.promisify(uploadFile);
//module.exports = uploadFileMiddleware;
module.exports = uploadFile;