const config = require("../config/auth.config");

const { v4: uuidv4 } = require("uuid");

/**
 * jeton d'actualisation.
 * date et heure d'expiration du jeton.
 * ainsi que utilisateur associe que l'utilisateur associé au 
 * jeton d'actualisation sont tous conservés dans ce tableau
 */

module.exports = (sequelize,DataTypes) =>{

    const RefreshToken = sequelize.define("refreshToken", {
        token: {
          type: DataTypes.STRING,    
        },
        expiryDate: {
          type: DataTypes.DATE,       
        },
      });

      /**
       * 
       * Créez une fonction qui génère un jeton d'actualisation 
       * avec une date d'expiration et l'attribue à un utilisateur
       * 
       */
      RefreshToken.createToken = async function (user) {
        let expiredAt = new Date();
        //process.env.JWT_REFRESH_EXPIRATION
        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
    
        let _token = uuidv4();
    
        let refreshToken = await this.create({
          token: _token,
          userId: user.id,
          expiryDate: expiredAt.getTime(),
        });
    
        return refreshToken.token;
      };
    

      /**
       * 
       * Créez une fonction qui vérifie la validité des jetons
       *  Cette fonction se chargera de vérifier la période d'expiration 
       * du jeton de rafraîchissement.
       */
      RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
      };



      RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.user,{
            foreignKey: 'userId', 
            targetKey: 'id'
        });

    };
    
      return RefreshToken;
}