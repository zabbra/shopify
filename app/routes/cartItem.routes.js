// routes/cartItemRoutes.js
const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItem.controller');


/**
 * @swagger
 * components:
 *   schemas:
 *     CartItems:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: ID du produit à ajouter.
 *           default: 2
 *         quantity:
 *           type: integer
 *           description: Quantité du produit à ajouter.
 *           default: 2
 */





/** POST Methods : Créer un nouvel élément de panier*/
    /**
     * @swagger
     * /api/carts/{cartId}/add-item:
     *   post:
     *     tags:
     *       - CartItems
     *     summary: Ajouter un produit au panier.
     *     description: Permet à un utilisateur d'ajouter un produit à son panier.
     *     parameters:
     *       - in: path
     *         name: cartId
     *         required: true
     *         description: ID du panier.
     *         schema:
     *           type: integer
     *       - in: body
     *         name: cartItem
     *         description: Détails du produit à ajouter.
     *         required: true
     *         schema:
     *           $ref: '#/components/schemas/CartItemItems'
     *     responses:
     *       '201':
     *         description: Élément du panier ajouté avec succès.
     *       '404':
     *         description: Panier non trouvé.
     *       '500':
     *         description: Erreur interne du serveur.
     */

router.post('/:cartId/add-item', cartItemController.addItemToCart);



/**
 * @swagger
 * /api/carts/item/{itemId}/update-quantity:
 *   put:
 *     tags:
 *       - CartItems
 *     summary: Mettre à jour la quantité d'un élément de panier.
 *     description: Permet à un utilisateur de modifier la quantité d'un produit dans son panier.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID de l'élément de panier à mettre à jour.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: updateCartItemQuantity
 *         description: Nouvelle quantité pour l'élément de panier.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: integer
 *               description: Nouvelle quantité de l'élément de panier.
 *     responses:
 *       '200':
 *         description: Quantité de l'élément de panier mise à jour avec succès.
 *       '400':
 *         description: Requête incorrecte. L'ID de l'élément de panier ou la quantité sont invalides.
 *       '404':
 *         description: Non trouvé. L'élément de panier n'a pas été trouvé.
 *       '500':
 *         description: Erreur interne du serveur. La mise à jour de la quantité de l'élément de panier a échoué.
 */

router.put('/item/:itemId/update-quantity', cartItemController.updateCartItemQuantity);




/** Supprimer un élément du panier */ 
    /**
     * @swagger
     * /api/cart/item/{itemId}/delete:
     *   delete:
     *     tags:
     *       - CartItems
     *     summary: Supprimer un élément du panier.
     *     description: Permet à un utilisateur de supprimer un produit de son panier.
     *     parameters:
     *       - in: path
     *         name: itemId
     *         required: true
     *         description: ID de l'élément à supprimer.
     *         schema:
     *           type: integer
     *     responses:
     *       '204':
     *         description: Élément du panier supprimé avec succès.
     *       '404':
     *         description: Non trouvé. L'élément du panier n'a pas été trouvé.
     *       '500':
     *         description: Erreur interne du serveur. La suppression de l'élément du panier a échoué.
     */
router.delete('/item/:itemId/delete', cartItemController.deleteCartItem);





/**
 * @swagger
 * /cart/{cartId}/items:
 *   get:
 *     tags:
 *       - CartItems
 *     summary: Obtenir tous les éléments du panier
 *     description: Permet d'obtenir la liste de tous les produits dans un panier.
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: ID du panier.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Liste de tous les produits dans le panier avec les détails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID du panier.
 *                 products:
 *                   type: array
 *                   description: Liste de produits dans le panier.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID du produit.
 *                       title:
 *                         type: string
 *                         description: Titre du produit.
 *                       price:
 *                         type: number
 *                         description: Prix du produit.
 *                       discountPercentage:
 *                         type: number
 *                         description: Pourcentage de réduction du produit.
 *                       images:
 *                         type: array
 *                         description: URLs des images du produit.
 *                         items:
 *                           type: string
 *                           format: url
 *                           description: URL d'une image du produit.
 *                       quantity:
 *                         type: integer
 *                         description: Quantité du produit dans le panier.
 *                       total:
 *                         type: number
 *                         description: Total du produit dans le panier.
 *                 total:
 *                   type: number
 *                   description: Total de tous les produits dans le panier.
 *                 discountedTotal:
 *                   type: number
 *                   description: Total de tous les produits avec réduction dans le panier.
 *                 totalProducts:
 *                   type: integer
 *                   description: Nombre total de produits dans le panier.
 *                 totalQuantity:
 *                   type: integer
 *                   description: Quantité totale de tous les produits dans le panier.
 *       '500':
 *         description: Erreur interne du serveur.
 */

router.get('/cart/:cartId/items', cartItemController.getAllCartItems);





/**
 * @swagger
 * /api/carts/item/{itemId}:
 *   get:
 *     tags:
 *       - CartItems
 *     summary: Obtenir un élément spécifique du panier
 *     description: Permet d'obtenir les détails d'un élément spécifique du panier.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         description: ID de l'élément du panier.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Détails de l'élément du panier demandé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Détails de l'élément du panier.
 *       '404':
 *         description: Élément du panier non trouvé.
 *       '500':
 *         description: Erreur interne du serveur.
 */

router.get('/item/:itemId', cartItemController.getCartItemsByCartId);

// Définir la route pour obtenir les détails d'un panier avec ses produits
router.get('/cart/:cartId/products', cartItemController.getCartByIdWithProducts);
// Obtenir tous les éléments de panier d'un panier spécifique
router.get('/:cartId/cartItems', cartItemController.getCartByIdWithProducts);

// Mettre à jour un élément de panier existant
router.put('/cartItems/:cartItemId', cartItemController.updateCartItem);







module.exports = router;

//router.post('/', cartItemController.addProductToCart);
//router.delete('/:id', cartItemController.removeProductFromCart);




//module.exports = router;



    /**
     * 
     * api/carts/cart/{cartId}/add-item:
     *   post:
     *     summary: Ajouter un produit au panier.
     *     description: Permet à un utilisateur d'ajouter un produit à son panier.
     *     parameters:
     *       - in: path
     *         name: cartId
     *         required: true
     *         description: ID du panier.
     *         schema:
     *           type: integer
     *       - in: body
     *         name: item
     *         description: Détails du produit à ajouter.
     *         required: true
     *         schema:
     *           type: object
     *           properties:
     *             productId:
     *               type: integer
     *               description: ID du produit à ajouter.
     *             quantity:
     *               type: integer
     *               description: Quantité du produit à ajouter.
     *     responses:
     *       '201':
     *         description: Élément du panier ajouté avec succès.
     *       '404':
     *         description: Panier non trouvé.
     *       '500':
     *         description: Erreur interne du serveur.
     */