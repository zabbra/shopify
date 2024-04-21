module.exports = (sequelize,DataTypes) => {
    const Image = sequelize.define('image', {
        id:{
            type:DataTypes.INTEGER(10).UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
        type: DataTypes.STRING, // ou BLOB si vous stockez les données binaires
        allowNull: false
      },
      data: {
        type: DataTypes.BLOB("long"),
      },
    },
    {paranoid:true})

    Image.associate = models => {
        Image.belongsTo(models.product,{
            foreignKey: 'productId', 
            targetKey: 'id',
        });
    };
    
    return Image
}