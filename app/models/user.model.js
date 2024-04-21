module.exports = (sequelize,DataTypes) =>{

    const User = sequelize.define('user',{
        id:{
            type:DataTypes.INTEGER(10).UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate:{
                isEmail:true, // Ici validation de donnée
            },
    
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        /*createdAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }*/
        
    },
    
    {paranoid:true}) // Ici pour faire du softDelete


    User.associate = models => {
        User.belongsToMany(models.role,{ 
            through: 'user_roles',
            uniqueKey: 'user_role_unique_key' 
        });
        User.hasMany(models.cart,{
            foreignKey: 'userId', 
            targetKey: 'id',
            onDelete: "cascade"
        });

        /**Par défaut, l'association est considérée comme facultative
         * En d’autres termes, dans notre exemple, le userId peut être null, 
         * ce qui signifie qu’un User peut exister sans User.
         * Changer cela est simplement une question de spécifier 
         * allowNull: falsedans les options de clé étrangère :
         */
        User.hasOne(models.refreshToken,{ // user peut exister sans refreshToken 
            foreignKey: 'userId', 
            targetKey: 'id',
            onDelete: "cascade"
        });
    };

    



    return User
}


