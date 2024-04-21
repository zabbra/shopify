module.exports = (sequelize,DataTypes) => {
  
    const Cart = sequelize.define('cart', {
      id:{//identifiant unique
        type:DataTypes.INTEGER(10).UNSIGNED,
        primaryKey:true,
        autoIncrement:true
      },
      total: { //total du panier
        type: DataTypes.DECIMAL,
      },
      discountedTotal: { //total du panier avec réduction
        type: DataTypes.DECIMAL,
      },
      totalProducts: {//nombre total de produits dans le panier
        type: DataTypes.INTEGER,
      },
      totalQuantity: {// quantité  total de produits dans le panier
        type: DataTypes.INTEGER,
      }
    },
    {paranoid:true}); 

    Cart.associate = models => {
      Cart.hasMany(models.cartItem,{
        foreignKey: 'cartId', 
        targetKey: 'id',
        onDelete: "cascade"
    });

      Cart.belongsTo(models.user,{
        foreignKey: 'userId', 
        targetKey: 'id',
        onDelete: "cascade"
    });

    };

  
    return Cart;
  };