const db = require("../models");
const Cart = db.cart;
const User = db.user
const CartItem = db.cartItem;




// Obtenir tous les paniers d'un utilisateur

const getUserCarts = async (req, res) => {
  try {
    const { userId } = req.params;
    const carts = await Cart.findAll({ 
      where: { userId },
      include: [CartItem] // Inclure les éléments du panier associés
    });
    return res.status(200).json({ data: carts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not get user carts' });
  }
};





const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    // Vérifier si le panier existe
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Supprimer tous les éléments du panier
    await CartItem.destroy({ where: { cartId } });

    // Réinitialiser les statistiques du panier à zéro
    cart.total = 0;
    cart.discountedTotal = 0;
    cart.totalProducts = 0;
    cart.totalQuantity = 0;

    // Enregistrer les modifications dans la base de données
    await cart.save();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not clear cart' });
  }
};







// Créer un nouveau panier pour un utilisateur
const createCartForUser = async (req, res) => {
  // Récupérer l'identifiant de l'utilisateur à partir de la requête
  let userId = parseInt(req.params.userId)
  // Vérification si le champ id est présent et cohérent
  if (!userId) {
    return res.status(400).json({ 
        message: 'Missing parameter' 
    })
  }
  try {
    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
          message: "User not found" 
      });
  }
    // Créer un nouveau panier pour l'utilisateur
    const cart = await Cart.create({ 
      userId:user.id,
      total:0,
      discountedTotal:0,
      totalProducts:0,
      totalQuantity:0
    });
    // Retourner le panier créé
    return res.status(201).json({data:cart});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create cart for user' });
    }
};
  

// Obtenir un panier par son ID
const getCartById = async (req, res) => {
  
  const cartId = parseInt(req.params.cartId);

  // Récupérer les informations du panier
  const cart = await Cart.findByPk(cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  // Récupérer les produits associés au panier
  const cartItems = await CartItem.findAll({ where: { cartId }, include: Product });

  if (!cartId) {
    return res.status(400).json({ 
        message: 'Missing parameter' 
    })
  }
  try {
      const cart = await Cart.findByPk(cartId);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      return res.status(200).json({data:cart});
      
    } catch (error) {
      console.error(error || 'Could not retrieve cart');
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
};


// Update Cart
const updateCart = async (req, res) => {
  try {
    const cartId = parseInt(req.params.cartId)
    if (!cartId) {
      return res.status(400).json({ 
          message: 'Missing parameter' 
      })
    }
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    await Cart.update(req.body);
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error: 'Could not update cart' });
  }
};


// Delete Cart
const deleteCart = async (req, res) => {

  let cartId = parseInt(req.params.cartId);
  if (!cartId) {
    return res.status(400).json({ 
        message: 'Missing parameter' 
    })
  }
  try {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    await CartItem.destroy({ where: {cartId} }); // Supprimer les éléments du panier
    await Cart.destroy({ where: { id: cartId } }); // Supprimer le panier lui-même
    return res.status(204).end();
  } catch (error) {
    console.error(error || 'Failed to delete cart' );
    return res.status(500).json({ error: 'Could not delete cart' });
  }
}




const calculateCartStats = async (cartId) => {
    try {
      const cartItems = await CartItem.findAll({ where: { cartId } });
      let total = 0;
      let discountedTotal = 0;
      let totalProducts = 0;
      let totalQuantity = 0;
  
      cartItems.forEach(item => {
        total += Number(item.total);
        discountedTotal += item.discountedPrice * item.quantity;
        totalProducts++;
        totalQuantity += item.quantity;
      });
  
      return { total, discountedTotal, totalProducts, totalQuantity };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to calculate cart stats');
    }
};


module.exports = {
  clearCart,
  createCartForUser,
  getUserCarts,
  getCartById,
  updateCart,
  deleteCart,
  calculateCartStats
}