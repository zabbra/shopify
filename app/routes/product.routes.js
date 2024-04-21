// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

const validateProduct = require('../middlewares/validateProduct');
const validateImage = require('../middlewares/validateImage');
const productController = require('../controllers/product.controller');
//@swagger

// Configuration de multer pour le téléchargement de fichiers
const uploadFile  = require('../middlewares/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - stock
 *         - brand
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The title of your product
 *           default : Produit 1
 *         description:
 *           type: string
 *           description: The description of your product
 *           default : description pour le produit 1
 *         price:
 *           type: number
 *           description: The price of your product
 *           default : 1500
 *         discountPercentage:
 *           type: number
 *           description: The discountPercentage of your product
 *           default : 10
 *         rating:
 *           type: number
 *           description: The rating of your product
 *           default : 5
 *         stock:
 *           type: integer
 *           description: The stock of your product
 *           default : 1000
 *         brand:
 *           type: string
 *           description: The brand of your product
 *           default : brand du produit
 *         categoryId:
 *           type: integer
 *           description: The category id associate of your product
 *           default: 1
 *         thumbnail:
 *           type: string
 *           format: binary
 *           description: The thumbnail of your product
 *       
 */













/** GET Methods : Récupérer tout les products */
    /**
     * @swagger
     * /api/products:
     *   get:
     *     tags:
     *     - Products 
     *     summary: Lists all the products
     *     description: Retrieve a list of products.
     *     responses:
     *       200:
     *         description: Fetched Successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Products'
     *       500:
     *         description: Some error happened
    */

router.get('/', productController.getAllProductsWithImages);




/** POST Methods : Créer une nouvelle produit */
    /**
     * @openapi
     * '/api/products':
     *  post:
     *     tags:
     *     - Products 
     *     summary: Create a new product
     *     requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/Products'
     *     responses:
     *      201:
     *        description: The created product
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some server error
     */

router.post('/', uploadFile.single('thumbnail'),validateProduct, productController.createProductWithImage);



/** GET Methods : Récupérer un  produit */
    /**
     * @openapi
     * '/api/products/{id}':
     *  get:
     *     tags:
     *     - Products 
     *     summary: Get the product by id
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *        description: The product Id 
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *        contens:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Products'
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some error happened
     */
router.get('/:id', productController.getProductById);




/** PUT Methods: Mettre à jour un produit existant avec une image  */
    /**
     * @openapi
     * '/api/products/{id}':
     *  put:
     *    tags:
     *    - Products
     *    summary: Update the product by the id
     *    parameters:
     *     - in: path
     *       name: id
     *       schema:
     *         type: integer
     *       description: The unique Id of the product
     *       required: true
     *    requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/Products'
     *    responses:
     *      200:
     *        description: The product was updated
     *        content:
     *          application/json:
     *           schema:
     *             $ref: '#/components/schemas/Products'
     *      400:
     *        description: Bad request
     *      404:
     *        description: The category was not found
     *      500:
     *        description: Some error happened
     */
router.put('/:id',uploadFile.single('thumbnail'), validateProduct, productController.updateProductWithImage);





/** DELETE Methods: Supprimer un produit */
    /**
     * @openapi
     * '/api/products/{id}':
     *  delete:
     *     tags:
     *     - Products 
     *     summary: Remove the product by id 
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        description: The unique Id of the product
     *        required: true
     *     responses:
     *      200:
     *        description: The product was deleted 
     *      400:
     *        description: Bad request
     *      404:
     *        description: The cagory was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/:id', productController.deleteProductWithImage);



module.exports = router;



/** POST Methods : Créer une nouvelle catégorie */
    /**
     * '/api/categories':
     *  post:
     *     tags:
     *     - Categories Controller
     *     summary: Create a new category
     *     consumes:
     *       - multipart/form-data
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Categories'
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */









// POST :Créer un produit avec une image








module.exports = router;