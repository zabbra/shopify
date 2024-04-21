module.exports = (sequelize,DataTypes) => {
  
    const CartItem = sequelize.define('cartItem', {
      id:{//identifiant unique
        type:DataTypes.INTEGER(10).UNSIGNED,
        primaryKey:true,
        autoIncrement:true
      },
      quantity: { //quantité du produit dans le panier
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: { //total pour ce produit dans le panier
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      discountPercentage: { //pourcentage de réduction pour ce produit
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      discountedPrice: {//prix réduit pour ce produit
        type: DataTypes.DECIMAL,
        allowNull: false
      },
    },
    {paranoid:true}); 

    CartItem.associate = models => {
        CartItem.belongsTo(models.cart,{
          foreignKey: 'cartId', 
          targetKey: 'id'
      });

    CartItem.belongsTo(models.product,{
      foreignKey: 'productId', 
      targetKey: 'id'
  });

    };

  
    return CartItem;
  };