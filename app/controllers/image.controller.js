const fs = require("fs");
const uploadFile = require("../middlewares/upload");
const db = require("../models");
const Image = db.image;
const Product = db.product;

const uploadFiles   = async (req, res) => {
    try {
      const {productId} = req.body;
      const existingProduct = await Product.findOne({ where: {id: productId }, raw: true });
        if (!existingProduct) {
            res.status(409).json({ message: `The product ${productId} do not exists !` });
        }
        //await uploadFile(req, res);
    
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        //creer la donnee binaire du fichier 
        const imageData = fs.readFileSync(
            __basedir + "/resources/static/assets/uploads/" + req.file.filename
        );

    

        // Récupérer l'URL du fichier sur le serveur
        const fileUrl = "/static/assets/tmp/" + req.file.filename;
        // Sauvegarder l'URL dans la base de données avec d'autres informations sur l'image
        const newImage = await Image.create({
            productId,
            type: req.file.mimetype,
            name: req.file.originalname,
            data: imageData,
            url: fileUrl // Sauvegarder l'URL de l'image dans la base de données
        });

        // Sauvegarder le fichier dans un dossier sur le serveur
        fs.writeFileSync(
            __basedir + "/resources/static/assets/tmp/" + req.file.filename,
            imageData
        );

        //await uploadFile(req, res);

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
              message: "File size cannot be larger than 2MB!",
            });
          }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
  };

  const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
  };
  
  const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
  
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };
  
  module.exports = {
    uploadFiles ,
    getListFiles,
    download,
  };