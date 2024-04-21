module.exports = (sequelize,DataTypes) =>{

    const Role = sequelize.define('role',{
        id:{
            type:DataTypes.INTEGER(10).UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique: true
        },
        
    },
    {paranoid:true}) // Ici pour faire du softDelete

    Role.associate = models => {
        Role.belongsToMany(models.user,{ 
            through: 'user_roles',
            uniqueKey: 'user_role_unique_key' 
        });
    };

    return Role
}
