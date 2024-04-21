const db = require("../models")
const ROLES = db.ROLES;
const User = db.user;
//return res.status(400).json({ msg: 'Missing parameter' })

const checkDuplicateUsernameOrEmail = async (req, res, next) => {

    try {
        const {username,email,password} = req.body

        // Validation des données reçues
        if(!username || !email || !password)
            return res.status(400).json({ message: 'Missing Parameter' })
        
        // Username
        const existingUser = await User.findOne({ where:{ username}, raw:true});

        if(existingUser !== null)
            return res.status(400).send({ message: "Failed! Username is already in use!" });

        // Email
        const existingEmailUser = await User.findOne({ where:{ email}, raw:true});

        if(existingEmailUser)
            return res.status(400).send({ message: "Failed! Email  is already in use!" });
        
        next();
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }

}


const checkRolesExisted = (req, res, next) => {

    try {
        if (req.body.roles) {
            
            for (const role of req.body.roles) { 
                if (!ROLES.includes(role)) { 
                    return res.status(400).send({
                        message: `Failed! Role ${role} does not exist!`
                    });
                }
            }
        }
        next();
        
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }

}


const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
  };
  
module.exports = verifySignUp;

