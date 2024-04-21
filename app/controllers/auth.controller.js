const db = require('../models')
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;


const Op = db.Sequelize.Op


const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")






const generateAccessToken = (user) => {
    return jwt.sign({id: user.id}, 
        config.secret,
        {
            algorithm:'HS256',
            allowInsecureKeySizes:true, 
            expiresIn: config.jwtExpiration, // 24 hours
        });
};


// Contrôleur pour l'enregistrement d'un utilisateur
const registerUser = async (req,res) =>{
    
    try {

        const {username, email, password} = req.body

        // Check if the email exists
        const userExists = await User.findOne({
            where: {email}
        });

        if (userExists) {
            return res.status(400).json({message:'Email is already associated with an account'});
        }
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hashSync(password, 10);

        // Créer un nouvel utilisateur avec les données fournies
       let  user = await User.create({
            username,
            email,
            password:hashedPassword
        });

       // Assign user roles
       if (req.body.roles) {
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        });
        await user.setRoles(roles);
      } else {
        await user.setRoles([1]); // default user role
      }

      // Send success response
      res.status(200).send({ message: "User was registered successfully!"});
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Error in registering user')
    }
}




const signInUser = async(req,res,next) =>{
    
    try{
        const {email,password} = req.body

        //Vérification des donnée recues
        if(!email || !password)
            return res.status(404).json("Missing parameters")
    

        const user = await User.findOne({where:{email},raw:false});

        // Verify if user exist
        if (!user) {
            console.log('User Not found')
            return res.status(404).json('Email not found');
        }
        

 

        // Verify password 
        let passwordIsValid = bcrypt.compareSync(password,user.password)
        if(!passwordIsValid){
            return res.status(401).json({
                accessToken:null,
                message:"Invalid Password!"
            });
        }


        // Authenticate user with jwt
        
            

        // Génération du token
        const token = generateAccessToken(user);

        let refreshToken = await RefreshToken.createToken(user);

        let authorities = [];
        //console.log(await user.getRoles())
        const roles = await user.getRoles();
        
        for(const role of roles){
            authorities.push("ROLE_" + role.name.toUpperCase());
        }
        // Réponse de la création de l'utilisateur
        return res.status(200).json({
            status:200,
            id: user.id,
            username:user.username,
            email:user.email,
            roles:authorities,
            accessToken: token,
           refreshToken: refreshToken,
        })
        
    }catch(err){
        console.log(err.message)
        res.status(500).send('Sign in error')
    }
}



const refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
  
    if (requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
  
    try {
      let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
  
      console.log(refreshToken)
  
      if (!refreshToken) {
        console.log("Invalid refresh token")
        res.status(403).json({ 
            message: "Refresh token is not in database!" 
        });
        return;
      }
  
      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.destroy({ where: { id: refreshToken.id } });
        
        res.status(403).json({
          message: "Refresh token was expired. Please make a new signin request",
        });
        return;
      }
      /**
       * const user = await db.User.findOne({
            where: {id: refreshToken.user},
            attributes: {
                exclude: ['password']
            }
        });
       */
      const user = await refreshToken.getUser();
      
      let newAccessToken = generateAccessToken(user);
      
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
        console.log({ message: err })
      return res.status(500).send("Internal server error");
    }
}

module.exports ={
    registerUser,
    signInUser,
    refreshToken
}

