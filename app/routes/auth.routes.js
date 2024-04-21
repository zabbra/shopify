const express = require('express');
const app = express()
const router = express.Router();

const validateUser = require("../middlewares/validateUser")
const { registerUser, signInUser, refreshToken} = require('../controllers/auth.controller')




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
 *         username:
 *           type: string
 *           description: The username of your user
 *         email:
 *           type: string
 *           description: The email of your user
 *         password:
 *           type: string
 *           format: binary
 *           description: The password of your user 
 *      
 *       
 */














/** POST Methods : Registration route */
    /**
     * @openapi
     * '/api/auth/sign-up':
     *  post:
     *     tags:
     *     - auth 
     *     summary: Create a new user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            required:
     *              - username
     *              - email
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: Idriss
     *              email:
     *                 type: string
     *                 default: Idriss@gmail.com
     *              password:
     *                 type: string
     *                 default: 12345678
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some server error
     */
router.post('/sign-up',[
    validateUser,
], registerUser);





/** POST Methods : Sign In route */
    /**
     * @openapi
     * '/api/auth/sign-in':
     *  post:
     *     tags:
     *     - auth 
     *     summary: Login to your account 
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            required:
     *              - username
     *              - email
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: Idriss
     *              email:
     *                 type: string
     *                 default: Idriss@gmail.com
     *              password:
     *                 type: string
     *                 default: Idriss!@
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some server error
     */
router.post('/sign-in',signInUser);




// Refresh token route
router.post('/refresh-token', refreshToken);









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



 
    router.put('/signup',[
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ], authController.signup);

    

    router.post('/signin', authController.signin);



    return router;

}*/