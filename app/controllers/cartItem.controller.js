// controllers/cartItemController.js
const db = require("../models");

const CartItem = db.cartItem;
const Cart = db.cart;
const User = db.user;
const Product = db.product;

const { calculateCartStats } = require('./cart.controller');



// Contrôleur pour ajouter un produit au panier
const addItemToCart = async (req, res) => {
  try {
    // Extraire l'ID du panier et l'ID du produit à partir des paramètres de la requête
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
      return res.status(400).json({ 
          message: 'Missing parameter' 
      })
    }

    // Vérifier si le produit existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Vérifier si le panier de l'utilisateur existe
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      // Si le panier n'existe pas, le créer
      cart = await Cart.create({ userId,total: 0,discountedTotal: 0,totalProducts: 0,totalQuantity: 0});
      cart = await Cart.create({ userId });
    }


    // Créer un nouvel élément de panier avec les détails fournis
    const cartItem = await CartItem.create({
      productId,
      quantity,
      total: product.price * quantity,
      cartId: cart.id
    });

    return res.status(201).json({ message: 'CartItem created successfully', data: cartItem });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not create cartItem' });
  }
};




// Contrôleur pour mettre à jour la quantité d'un élément de panier
const updateCartItemQuantity = async (req, res) => {
  try {
    // Extraire l'ID de l'élément de panier et la nouvelle quantité à partir des paramètres de la requête
    const { itemId } = req.params;
    const { quantity } = req.body;


     // Vérifier si l'élément de panier existe
     const cartItem = await CartItem.findByPk(itemId);
     if (!cartItem) {
       return res.status(404).json({ error: 'CartItem not found' });
     }
     //Récupérer le cartId à partir de l'élément de panier
     const cartId = cartItem.cartId;
 
     // Vérifier si le panier existe
     const cart = await Cart.findByPk(cartId);
     if (!cart) {
       return res.status(404).json({ error: 'Cart not found' });
     }


    // Mettre à jour la quantité de l'élément de panier
    cartItem.quantity = quantity;
    await cartItem.save();

    // Recalculer les statistiques du panier
    const { total, discountedTotal, totalProducts, totalQuantity } = await calculateCartStats(cartId);

    // Mettre à jour les valeurs du panier
    cart.total = total;
    cart.discountedTotal = discountedTotal;
    cart.totalProducts = totalProducts;
    cart.totalQuantity = totalQuantity;
    await cart.save();
    return res.status(200).json({ message: 'CartItem quantity updated successfully', data: cartItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not update cartItem quantity' });
  }
};




const getAllCartItems = async (req, res) => {
  try {
    const { cartId } = req.params;

    // Rechercher tous les éléments du panier spécifié avec les détails des produits associés
    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [
        { 
          model: Product, 
          attributes: ['id', 'title', 'price', 'discountPercentage'], 
          include: [{ model: Image, attributes: ['url'] }] // Inclure les images du produit
        }
      ]
    });

    // Calculer les totaux du panier
    let total = 0;
    let discountedTotal = 0;
    let totalProducts = 0;
    let totalQuantity = 0;

    cartItems.forEach(item => {
      total += item.total;
      discountedTotal += item.discountedPrice * item.quantity;
      totalProducts++;
      totalQuantity += item.quantity;
    });

    // Créer la réponse avec la structure demandée
    const response = {
      id: cartId,
      products: cartItems.map(item => ({
        id: item.productId,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        total: item.total,
        discountPercentage: item.product.discountPercentage,
        discountedPrice: item.discountedPrice,
        thumbnail: item.product.thumbnail,
        images: item.product.images.map(image => image.url)
      })),
      total,
      discountedTotal,
      totalProducts,
      totalQuantity
    };

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not get cart items' });
  }
};




const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Vérifier si l'élément du panier existe
    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Supprimer l'élément du panier
    await cartItem.destroy();

    // Recalculer les statistiques du panier
    const cartId = cartItem.cartId;
    const cartStats = await calculateCartStats(cartId);

    // Mettre à jour les données du panier
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Mettre à jour les propriétés du panier
    cart.total = cartStats.total;
    cart.discountedTotal = cartStats.discountedTotal;
    cart.totalProducts = cartStats.totalProducts;
    cart.totalQuantity = cartStats.totalQuantity;

    // Enregistrer les modifications dans la base de données
    await cart.save();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not delete cart item' });
  }
};





const getCartItemsByCartId = async (req, res) => {
  try {
    const { cartId } = req.params;

    // Recherche de tous les éléments du panier spécifié
    const cartItems = await CartItem.findAll({ where: { cartId } });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ error: 'No cart items found for this cart' });
    }

    // Initialisation de la liste des détails des éléments du panier
    let cartItemsDetails = [];

    // Parcourir chaque élément du panier
    for (const cartItem of cartItems) {
      // Récupération des détails du produit associé à l'élément du panier
      const product = await Product.findByPk(cartItem.productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Construction de la structure de données avec les détails du produit
      const cartItemDetails = {
        id: cartItem.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: cartItem.quantity,
        total: cartItem.total,
        discountPercentage: product.discountPercentage,
        discountedPrice: cartItem.discountedPrice,
        thumbnail: product.thumbnail,
      };

      // Ajout des détails de l'élément du panier à la liste
      cartItemsDetails.push(cartItemDetails);
    }

    return res.status(200).json({ data: cartItemsDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not get cart items' });
  }
};











const getCartByIdWithProducts = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    // Récupérer les informations du panier
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Récupérer les produits associés au panier
    const cartItems = await CartItem.findAll({ where: { cartId }, include: Product });

    // Calculer les statistiques du panier
    let total = 0;
    let discountedTotal = 0;
    let totalProducts = 0;
    let totalQuantity = 0;

    const products = cartItems.map(cartItem => {
      const product = cartItem.Product;
      const itemTotal = cartItem.total;
      total += itemTotal;
      discountedTotal += cartItem.discountedPrice * cartItem.quantity;
      totalProducts++;
      totalQuantity += cartItem.quantity;

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: cartItem.quantity,
        total: itemTotal,
        discountPercentage: cartItem.discountPercentage,
        discountedPrice: cartItem.discountedPrice,
        thumbnail: product.thumbnail
      };
    });

    // Retourner les données du panier avec les informations des produits associés
    return res.status(200).json({
      id: cart.id,
      products,
      total,
      discountedTotal,
      userId: cart.userId,
      totalProducts,
      totalQuantity
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch cart with products' });
  }
};




// Mettre à jour un élément de panier existant
const updateCartItem = async (req, res) => {
  try {
      const cartItemId = req.params.cartItemId;
      const { quantity } = req.body;
      const updatedCartItem = await CartItem.update({ quantity }, { where: { id: cartItemId } });
      if (updatedCartItem[0] === 1) {
          res.json({ message: 'CartItem updated successfully' });
      } else {
          res.status(404).json({ message: 'CartItem not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update CartItem' });
  }
};









// Supprimer un produit du panier
exports.removeProductFromCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { id: req.params.itemId } });
    const { total, discountedTotal, totalProducts, totalQuantity } = await calculateCartStats(req.params.cartId);
    res.status(200).json({ total, discountedTotal, totalProducts, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove product from cart' });
  }
}



module.exports = {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getAllCartItems,
  getCartItemsByCartId,
  getCartByIdWithProducts,
  updateCartItem,

}