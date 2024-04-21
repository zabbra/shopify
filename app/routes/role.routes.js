// routes/roleRoutes.js

const express = require('express');
const router = express.Router();


const validateRole = require('../middlewares/validateRole');

const roleController = require('../controllers/role.controller');



/**
 * @swagger
 * components:
 *   schemas:
 *     Roles:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of your role
 *       
 */













/** GET Methods : Récupérer tout les rôles */
    /**
     * @swagger
     * /api/roles:
     *   get:
     *     tags:
     *     - Roles 
     *     summary: Lists all the roles
     *     description: Retrieve a list of roles.
     *     responses:
     *       200:
     *         description: Fetched Successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Roles'
     *       500:
     *         description: Some error happened
    */

router.get('/', roleController.getAllRoles);



/** POST Methods : Route pour créer un nouveau rôle */
    /**
     * @openapi
     * /api/roles:
     *  post:
     *     tags:
     *     - Roles
     *     summary: Create a new role
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Roles'
     *     responses:
     *      201:
     *        description: The role was created Successfully
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some server error
     */
router.post('/', validateRole,roleController.createRole);









/** GET Methods : Récupérer un  rôle a partir de son id */
    /**
     * @openapi
     * '/api/roles/{id}':
     *  get:
     *     tags:
     *     - Roles 
     *     summary: Get the role by id
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *        description: The role Id 
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *        contens:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Roles'
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some error happened
     */
router.get('/:id', roleController.getRoleById);




/** PUT Methods: Mettre à jour un role existant a partir de son id   */
    /**
     * @openapi
     * '/api/roles/{id}':
     *  put:
     *    tags:
     *    - Roles 
     *    summary: Update the role by the id
     *    parameters:
     *     - in: path
     *       name: id
     *       schema:
     *         type: integer
     *       description: The unique Id of the role
     *       required: true
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Roles'
     *    responses:
     *      200:
     *        description: The role was updated
     *        content:
     *          application/json:
     *           schema:
     *             $ref: '#/components/schemas/Roles'
     *      400:
     *        description: Bad request
     *      404:
     *        description: The role was not found
     *      500:
     *        description: Some error happened
     */
router.put('/:id',validateRole,roleController.updateRole);





/** DELETE Methods: Supprimer un role a partir de son id */
    /**
     * @openapi
     * '/api/roles/{id}':
     *  delete:
     *     tags:
     *     - Roles 
     *     summary: Remove the role by id 
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        description: The unique Id of the role
     *        required: true
     *     responses:
     *      200:
     *        description: The role was deleted 
     *      400:
     *        description: Bad request
     *      404:
     *        description: The role was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/:id', roleController.deleteRole);



/** DELETE Methods: Supprimer tout les roles */
    /**
     * @openapi
     * '/api/roles':
     *  delete:
     *     tags:
     *     - Roles 
     *     summary: Remove all roles  
     *     responses:
     *      200:
     *        description: The roles were deleted 
     *      400:
     *        description: Bad request
     *      404:
     *        description: The role was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/', roleController.deleteAllRole);

module.exports = router;


