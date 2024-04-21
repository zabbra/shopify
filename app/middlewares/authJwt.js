/********************************************* */
/*** Import des modules nécessaires***** */
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config")
const db = require("../models");
const User = db.user;

//ajout
const { TokenExpiredError } = jwt;




const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.status(401).send({ message: "Unauthorized!" });
}


const verifyToken = (req, res, next) => {

    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json({
          message: "No token provided!"
        });
    }
    //config.secret
    jwt.verify(token,config.secret,(err, decoded) =>{
        if(err) {
          return catchError(err, res);
            /*return res.status(401).send({
              message: "Unauthorized!",
            });*/
        }
        //req. user = decoded;
        req.userId = decoded.id;
        next();

    })
}

// Middleware pour vérifier les autorisations de l'utilisateur
const authorizeUser = (req, res, next) => {
  // Vérifier si l'utilisateur a accès aux ressources spécifiées dans la requête
  if (req.userId != req.params.id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
  }
  next(); // Passer au middleware suivant
};

const isAdmin = async(req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
      
                return;
        throw new Error('Require Admin Role!');
    } catch (error) {
        res.status(403).send({
            message: error.message
          })
    }
}

const isModerator = async(req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (const role of roles) {
            if (role.name === 'moderator') {
                next();
                return;
            }
        }
        throw new Error('Require Moderator Role!');
    } catch (error) {
        res.status(403).send({
            message: error.message
          })
    }
}

const isModeratorOrAdmin = async(req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (const role of roles) {
            if (role.name === "moderator") {
              next();
              return;
            }
    
            if (role.name === "admin") {
              next();
              return;
            }
        }
        throw new Error("Require Moderator or Admin Role!");
        
    } catch (error) {
        res.status(403).send({
            message: error.message
        })
    }
   
  };

  const authJwt = {
    verifyToken: verifyToken,
    authorizeUser,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
  };
  
  module.exports = authJwt;

