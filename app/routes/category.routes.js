// routes/categoryRoutes.js

const express = require('express');
const router = express.Router();


const validateCategory = require('../middlewares/validateCategory');
const categoryController = require('../controllers/category.controller');

// Configuration de multer pour le téléchargement de fichiers
const uploadFile  = require('../middlewares/upload');


/**
 * @swagger
 * components:
 *   schemas:
 *     Categories:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - thumbnail
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The name of your category
 *           default: smart phone
 *         description:
 *           type: string
 *           description: The description of your category
 *           default: description pour un telephone smart phone
 *         thumbnail:
 *           type: string
 *           format: binary
 *           description: The thumbnail of your category
 */









   /** GET Methods : Récupérer tout les categories */
    /**
     * @swagger
     * /api/categories:
     *   get:
     *     tags:
     *     - Categories
     *     summary: Lists all the categories
     *     description: Retrieve a list of categories.
     *     responses:
     *       200:
     *         description: Fetched Successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Categories'
     *       500:
     *         description: Some error happened
    */

router.get('/', categoryController.getAllCategories);




/** POST Methods : Créer une nouvelle catégorie */
    /**
     * @openapi
     * '/api/categories':
     *   post:
     *     tags:
     *     - Categories
     *     summary: Create a new category
     *     requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/Categories'
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

router.post('/',uploadFile.single("thumbnail") ,validateCategory,categoryController.createCategory);



/** GET Methods : Récupérer une  catégorie */
    /**
     * @openapi
     * '/api/categories/{id}':
     *  get:
     *     tags:
     *     - Categories
     *     summary: Get the category by id
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *        description: The category Id 
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *        contens:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Categories'
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some error happened
     */
router.get('/:id', categoryController.getCategoryById);

/** PUT Methods: Mettre à jour une catégorie existante */
    /**
     * @openapi
     * '/api/categories/{id}':
     *  put:
     *    tags:
     *    - Categories
     *    summary: Update the category by the id
     *    parameters:
     *     - in: path
     *       name: id
     *       schema:
     *         type: integer
     *       description: The unique Id of the category
     *       required: true
     *    requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *          schema:
     *            $ref: '#/components/schemas/Categories'
     *    responses:
     *      200:
     *        description: The category was updated
     *        content:
     *          application/json:
     *           schema:
     *             $ref: '#/components/schemas/Categories'
     *      400:
     *        description: Bad request
     *      404:
     *        description: The category was not found
     *      500:
     *        description: Some error happened
     */
router.put('/:id', uploadFile.single("thumbnail") ,validateCategory, categoryController.updateCategory);





/** DELETE Methods: Supprimer une catégorie */
    /**
     * @openapi
     * '/api/categories/{id}':
     *  delete:
     *     tags:
     *     - Categories
     *     summary: Remove the category by id 
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        description: The unique Id of the category
     *        required: true
     *     responses:
     *      200:
     *        description: The category was deleted 
     *      400:
     *        description: Bad request
     *      404:
     *        description: The cagory was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/:id', categoryController.deleteCategory);



/** DELETE Methods: Supprimer toute les catégories */
    /**
     * @openapi
     * '/api/categories':
     *  delete:
     *     tags:
     *     - Categories
     *     summary: Remove all categories 
     *     responses:
     *      200:
     *        description: All categories  was deleted 
     *      400:
     *        description: Bad request 
     *      500:
     *        description: Some error happened
     */
router.delete('/', categoryController.deleteAllCategory);







module.exports = router;



/** POST Methods : Créer une nouvelle catégorie */
    /**
     * '/api/categories':
     *  
     *    createdAt:
 *           type: string
 *           format: date
 *           description: The date the category was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the category was updated
 *         deletedAt:
 *           type: string
 *           format: date
 *           description: The date the category was deleted
     */