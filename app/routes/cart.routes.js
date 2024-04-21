const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');


/**
 * @swagger
 * components:
 *   schemas:
 *     Carts:
 *       type: object
 *       required:
 *         - id
 *         - total
 *         - discountedTotal
 *         - totalProducts
 *         - totalQuantity
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the cart
 *         total:
 *           type: number
 *           description: The total of cart
 *         discountedTotal:
 *           type: number
 *           description: total du panier avec réduction
 *         totalProducts:
 *           type: number
 *           description: nombre total de produits dans le panier
 *         totalQuantity:
 *           type: number
 *           description: quantité  total de produits dans le panier
 *         userId:
 *           type: integer
 *           description: The category id associate of your product
 *       
 */






/**
 * @swagger
 * /user/{userId}/carts:
 *   get:
 *     tags:
 *       - Carts
 *     summary: Obtenir tous les paniers d'un utilisateur
 *     description: Permet d'obtenir la liste de tous les paniers d'un utilisateur.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Liste des paniers de l'utilisateur récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       '500':
 *         description: Erreur interne du serveur lors de la récupération des paniers.
 */

router.get('/user/:userId/carts', cartController.getUserCarts);



























/**
 * @swagger
 * api/carts/{cartId}/clear:
 *   delete:
 *     tags:
 *       - Carts
 *     summary: Vider le panier.
 *     description: Permet à un utilisateur de vider complètement son panier.
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: ID du panier à vider.
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Le panier a été vidé avec succès.
 *       '404':
 *         description: Panier non trouvé.
 *       '500':
 *         description: Erreur interne du serveur.
 */


router.delete('/cart/:cartId/clear', cartController.clearCart);









/** POST Methods : Créer un nouveau panier pour un utilisateur */
    /**
     * @openapi
     * '/api/carts/users/{userId}/cart':
     *  post:
     *     tags:
     *     - Carts
     *     summary: Create a new cart for user 
     *     parameters:
     *      - in: path
     *        name: userId
     *        schema:
     *          type: integer
     *        description: The unique user id 
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

router.post('/users/:userId/cart', cartController.createCartForUser);





/** GET Methods : Obtenir tous les paniers d'un utilisateur */
    /**
     * @swagger
     * /api/carts/users/{userId}/carts:
     *   get:
     *     tags:
     *     - Carts 
     *     summary: Lists all the carts of user
     *     description: Retrieve a list of cart of the user.
     *     responses:
     *       200:
     *         description: Fetched Successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Carts'
     *       500:
     *         description: Some error happened
    */
router.get('/users/:userId/carts', cartController.getUserCarts);


/** GET Methods : Obtenir un panier par son ID */
    /**
     * @openapi
     * '/api/carts/{cartId}':
     *  get:
     *     tags:
     *     - Carts 
     *     summary: Get the cart by id
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        required: true
     *        description: The card Id 
     *     responses:
     *      200:
     *        description: Cart fetched Successfully
     *        contens:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/Carts'
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Some error happened
     */
router.get('/:cartId', cartController.getCartById);




/** DELETE Methods: Supprimer un panier */
    /**
     * @openapi
     * '/api/carts/{cartId}':
     *  delete:
     *     tags:
     *     - Carts 
     *     summary: Remove the cart by id 
     *     parameters:
     *      - in: path
     *        name: id
     *        schema:
     *          type: integer
     *        description: The unique Id of the cart
     *        required: true
     *     responses:
     *      200:
     *        description: Cart deleted sucessfully 
     *      400:
     *        description: Bad request
     *      404:
     *        description: The cart was not found 
     *      500:
     *        description: Some error happened
     */
router.delete('/:cartId', cartController.deleteCart);





module.exports = router;