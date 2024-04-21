const fs = require('fs');
const path = require('path');

module.exports = (sequelize,DataTypes) =>{

    const Category = sequelize.define('category',{
        id:{
            type:DataTypes.INTEGER(10).UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        name :{
            type:DataTypes.STRING,
            allowNull:false
        },
        description :{
            type:DataTypes.STRING,
            allowNull:false
        },
        thumbnail :{
            type:DataTypes.STRING,
            allowNull:true
        },
        
        
        
    },
    {paranoid:true}) ;


    Category.associate = (models) => {
        Category.hasMany(models.product, {
            foreignKey: 'categoryId', 
            targetKey: 'id',
            onDelete : "cascade",
        });
    };


        Category.beforeDestroy(async (category, options) => {
            try {
                if (category.thumbnail) {
                  // Chemin complet vers le fichier image
                  const imagePath = path.join(__dirname, '..', 'uploads', category.thumbnail);
                  console.log(imagePath)
                   
                  // Supprimer le fichier image associé à la catégorie
                  fs.unlinkSync(imagePath);
                }
              } catch (err) {
                console.error(err);
              }
      });

    
    
    // Hook pour supprimer l'image associée avant de supprimer la catégorie
    
    

    return Category
}