module.exports = (sequelize,DataTypes) =>{

    const Product = sequelize.define('product',{
        id:{
            type:DataTypes.INTEGER(10).UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        title :{
            type:DataTypes.STRING,
            allowNull:false
        },
        description :{
            type:DataTypes.TEXT,
            allowNull:false
        },
        price :{
            type:DataTypes.DECIMAL,
            allowNull:false
        },
        discountPercentage :{
            type:DataTypes.DECIMAL,
            allowNull: true
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        stock :{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        brand :{
            type:DataTypes.STRING,
            allowNull:false
        },
        
        thumbnail :{
            type:DataTypes.STRING,
            allowNull: true
        }
        
        
        
        
    },
    {paranoid:true}) // Ici pour faire du softDelete

    Product.associate = (models) => {
        Product.belongsTo(models.category,{
            foreignKey: 'categoryId', 
            targetKey: 'id',
        });

        Product.hasMany(models.image,{
            foreignKey: 'productId', 
            targetKey: 'id',
            onDelete: "cascade"
        });

        Product.hasMany(models.cartItem,{
            foreignKey: 'productId', 
            targetKey: 'id',
            onDelete: "cascade"
        });
    };

   

   

    return Product
}
