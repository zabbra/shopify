const express = require("express");
const router = express.Router();
const controller = require("../controllers/image.controller");
const uploadFile  = require('../middlewares/upload');

router.post("/upload",uploadFile.single("image"), controller.uploadFiles);
router.get("/files", controller.getListFiles);
router.get("/files/:name", controller.download);



module.exports = router;