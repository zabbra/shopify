const db = require("../models");
const bcrypt = require("bcrypt")
const User = db.user;
const Role = db.role;



const getAllUsers = async (req, res) => {
    
    try {
        const users = await User.findAll({
            attributes: { 
                exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
            },
            include: {
                model: Role,
                attributes: ['id', 'name'],
                through: { attributes: [] } // Pour exclure les attributs de la table de jointure
            } 
        });

        // Formater les données des utilisateurs avec leurs rôles
        const formattedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles ? user.roles.map(role => ({ id: role.id, name: role.name })) : []
        }));
        return res.json({message:"Users fetchings Successfully",data:formattedUsers});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Obtenir un utilisateur par son ID

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing Parameter' })
    }
    try {

        const user = await User.findByPk(userId, {
            attributes: { 
                exclude: ['password','createdAt', 'updatedAt', 'deletedAt'] 
            },
            include: {
                model: Role,
                attributes: ['id', 'name'],
                through: { attributes: [] } // Pour exclure les attributs de la table de jointure
            }
        });
        
        
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        
        // Formater les données de l'utilisateur avec ses rôles
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles ? user.roles.map(role => ({ id: role.id, name: role.name })):[]
        };

        return res.json({message:"User fetch Successfully",data:userData});
    } catch (err) {
        console.error(err.message || "Internal server error");
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

const createUser = async(req,res) =>{

    const { username, email, password, roles } = req.body;
    

    try {
        // Validation des données reçues
        if(!username || !email || !password){
            return res.status(400).json({ message: 'Missing parameter' })
        }
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email }, raw: true });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already associated with an account' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hashSync(password, 10);

        // Créer un nouvel utilisateur avec les données fournies
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword
        })

        // Récupérer les rôles spécifiés dans la requête
        let assignedRoles = [];
        if (roles && roles.length > 0) {
            assignedRoles = await Role.findAll({ 
                where: { 
                    id: roles // Same as using `id: { [Op.in]: [1,3] }`
                } 
            });
        }

        // Si aucun rôle n'est spécifié dans la requête, assigner le rôle par défaut
        if (assignedRoles.length === 0) {
            const defaultRole = await Role.findOne({ where: { name: 'user' } });
            if (defaultRole) {
                assignedRoles.push(defaultRole);
            }
        }

        // Assigner les rôles à l'utilisateur
        await newUser.setRoles(assignedRoles);

        return res.status(201).json({
            message:"User created successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create user' });
    }

}

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ 
            message: 'Missing parameter' 
        })
    }

    try {

        // Vérifier si l'utilisateur existe
        let user = await User.findByPk(userId,{
            attributes: { 
                exclude: ['password','createdAt', 'updatedAt', 'deletedAt']
            },
            include: {
                model: Role,
                attributes: ['id', 'name'],
                through: { attributes: [] } // Pour exclure les attributs de la table de jointure
            } 
        });
        if (!user){
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hashSync(req.body.password, 10);

        
        // Mettre à jour les informations de l'utilisateur avec les données fournies
        let updatedUser = {
            id: userId,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        };
        await User.update(updatedUser,{where:{id:userId}});
        let userData = {
            id: userId,
            username: req.body.username,
            email: req.body.email,
        };

         // Renvoyer une réponse avec les nouvelles informations de l'utilisateur
        return res.json({ message: 'User updated successfully', data: userData });

    } catch (err) {
        console.error(err.message || 'Erreur serveur');
        return res.status(500).json({ message: 'Failed to update user' });
    }
};


// Supprimer un utilisateur
const deleteUser = async (req, res) => {

    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    try {
        let existingUser = await User.findByPk(userId);
        if (!existingUser) return res.status(404).json({message: 'This user does not exist!'});

        await User.destroy({ where: { id: userId }, force: true });
        
        return res.status(204).json({message: 'Role deleted sucessfully'})
    } catch (err) {
        console.error(err.message || 'Erreur serveur');
        return res.status(500).json({ message: 'Failed to delete user' });
    }
};


// Méthode pour attribuer un rôle à un utilisateur
const assignRoleToUser = async (req, res) => {
    const { userId, roleId } = req.params;
    // Vérification si le champ id est présent et cohérent
    if (!roleId && !userId) {
        return res.status(400).json({ message: 'Missing Parameter' })
    }

    try {
      
  
      // Vérifier si l'utilisateur existe dans la base de données
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Vérifier si le rôle existe dans la base de données
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      // Vérifier si l'utilisateur a déjà ce rôle
      const hasRole = await user.hasRole(role);
      if (hasRole) {
        return res.status(400).json({ message: 'User already has this role' });
      }
  
      // Attribuer le rôle à l'utilisateur
      await user.addRole(role);
  
      // Retourner une réponse réussie
      res.status(200).json({ message: 'Role assigned to user successfully' });
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      return res.status(500).json({ message: 'Failed to assign role to user' });
    }
};
  
 
  
// Méthode pour révoquer un rôle d'un utilisateur
const revokeRoleFromUser = async (req, res) => {

    const { userId, roleId } = req.params;
    // Vérification si le champ id est présent et cohérent
    if (!roleId && !userId) {
        return res.status(400).json({ message: 'Missing Parameter' })
    }

    try {

      // Vérifier si l'utilisateur existe dans la base de données
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Vérifier si le rôle existe dans la base de données
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
  
      // Vérifier si l'utilisateur a ce rôle
      const hasRole = await user.hasRole(role);
      if (!hasRole) {
        return res.status(400).json({ message: "User doesn't have this role" });
      }
  
      // Révoquer le rôle de l'utilisateur
      await user.removeRole(role);
  
      // Retourner une réponse réussie
      res.status(200).json({ message: 'Role revoked from user successfully' });
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      return res.status(500).json({ message: 'Failed to revoke role from user' });
    }
  };






  module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    assignRoleToUser,
    revokeRoleFromUser
}