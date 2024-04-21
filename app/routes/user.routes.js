const express = require('express');
const app = express();
const router = express.Router();
const validateUser = require('../middlewares/validateUser');

const {authJwt} = require("../middlewares");
const userController = require('../controllers/user.controller')

router.use(function(req,res,next){
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next();
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of your user
 *         email:
 *           type: string
 *           description: The email of your user
 *         password:
 *           type: string
 *           description: The password of your user
 */



/** GET Methods : Récupérer tout les utilisateurs */
    /**
     * @swagger
     * /api/users:
     *   get:
     *     tags:
     *     - Users 
     *     summary: Lists all the users
     *     description: Retrieve a list of users.
     *     responses:
     *       200:
     *         description: Fetched Successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Users'
     *       500:
     *         description: Some error happened
    */
router.get('/',[authJwt.verifyToken,authJwt.authorizeUser],userController.getAllUsers);


/** POST Methods : Créer une nouvelle utilisateur */
    /**
     * @openapi
     * /api/users:
     *  post:
     *     tags:
     *     - Users 
     *     summary: Create a new user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Users'
     *     responses:
     *      201:
     *        description: User created successfully
     *      409:
     *        description: Conflict
     *      500:
     *        description: Some server error
     */


router.post('/', [authJwt.verifyToken,authJwt.isAdmin],validateUser,userController.createUser);



/** GET Methods : Récupérer un  utilisateur */
    /**
     * @openapi
     * '/api/users/{id}':
     *  get:
     *     tags:
     *     - Users 
     *     summary: Get the user by id
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *        description: The user Id 
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *        contens:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Users'
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some error happened
     */
router.get('/:id', [authJwt.verifyToken,authJwt.authorizeUser], userController.getUserById);






/** PUT Methods: Mettre à jour une catégorie existante */
    /**
     * @openapi
     * '/api/users/{id}':
     *  put:
     *    tags:
     *    - Users
     *    summary: Update the user by the id
     *    parameters:
     *     - in: path
     *       name: id
     *       schema:
     *         type: integer
     *       description: The unique Id of the user
     *       required: true
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/Users'
     *    responses:
     *      200:
     *        description: The user was updated Successfully
     *        content:
     *          application/json:
     *           schema:
     *             $ref: '#/components/schemas/Users'
     *      400:
     *        description: Bad request
     *      404:
     *        description: The user was not found
     *      500:
     *        description: Some error happened
     */

router.put('/:id',[authJwt.verifyToken,authJwt.authorizeUser],validateUser,userController.updateUser);






/** DELETE Methods: Route pour révoquer un rôle d'un utilisateur */
    /**
     * @openapi
     * '/api/users/{id}':
     *  delete:
     *     tags:
     *     - Users 
     *     summary: Remove user in database
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        description: The unique user id 
     *        required: true
     *     responses:
     *      200:
     *        description: User deleted  successfully 
     *      400:
     *        description: Bad request
     *      404:
     *        description: User  was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/:id',[authJwt.verifyToken,authJwt.authorizeUser],userController.deleteUser);






/** POST Methods: Route pour attribuer un rôle à un utilisateur */
    /**
     * @openapi
     * '/api/users/{userId}/roles/{roleId}/assign':
     *  post:
     *     tags:
     *     - Users 
     *     summary: Assign the role from user 
     *     parameters:
     *      - in: path
     *        name: userId
     *        schema:
     *          type: integer
     *        description: The unique user id 
     *      - in: path
     *        name: roleId
     *        schema:
     *          type: integer
     *        description: The unique role id 
     *        required: true
     *     responses:
     *      200:
     *        description: Role assigned to user successfully
     *      400:
     *        description: Bad request
     *      404:
     *        description: Role or User  was not found 
     *      500:
     *        description: Some error happened
     */
router.post('/:userId/roles/:roleId/assign', userController.assignRoleToUser);




/** DELETE Methods: Route pour révoquer un rôle d'un utilisateur */
    /**
     * @openapi
     * '/api/users/{userId}/roles/{roleId}/revoke':
     *  delete:
     *     tags:
     *     - Users 
     *     summary: Revoke role  from user
     *     parameters:
     *      - in: path
     *        name: userId
     *        schema:
     *          type: integer
     *        description: The unique user id 
     *      - in: path
     *        name: roleId
     *        schema:
     *          type: integer
     *        description: The unique role id 
     *        required: true
     *     responses:
     *      200:
     *        description: Role revoked from user successfully 
     *      400:
     *        description: Bad request
     *      404:
     *        description: Role or User  was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/:userId/roles/:roleId/revoke', userController.revokeRoleFromUser);


module.exports = router;

/*
module.exports = (app,express) =>{

    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next();
    })

    const router = express.Router();


    router.get('/all', userController.allAccess);
    router.get('/user',[authJwt.verifyToken] ,userController.userBoard);
    router.get('/mod',[authJwt.verifyToken,authJwt.isModerator] ,userController.moderatorBoard);
    router.get('/admin',[authJwt.verifyToken,authJwt.isAdmin] ,userController.adminBoard);
    

    router.post('/login', userController.adminBoard);



    return router;

}*/