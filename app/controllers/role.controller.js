const db = require("../models");
const Role = db.role;




// Méthode pour créer un nouveau rôle
const createRole = async(req,res) =>{

    try {
        
        const { name} = req.body;

        // Vérification si le role existe déjà
        const existingRole = await Role.findOne({ where: {name} });
        if (existingRole) {
            return res.status(409).json({ 
                message: 'Role already exists'
            });
        }

        // Enregistrer le role e dans la base de données
        const newRole = await Role.create({name});
        
        const roleResp ={
            id : newRole.id,
            name: newRole.name
        }
        
        return res.status(201).json({ 
            message: 'Role created successfully', 
            data: roleResp 
        });

    } catch (err) {
        console.error(err.message || 'Erreur serveur');
        return res.status(500).json({ message: 'Failed to create role' });
    }


};




const getAllRoles = async (req, res) => {
    
    try {
        const roles = await Role.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt','deletedAt'] } 
        });
        return res.json({message:"Roles fetchs Successfully",data:roles});
    } catch (err) {
        console.error(err.message || "Erreur serveur");
        return res.status(500).json({ message: 'Failed to fetch roles' });
    }
};


const getRoleById = async (req, res) => {
    const roleId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!roleId) {
        return res.status(400).json({ message: 'Missing Parameter' })
    }
    try {
        const role = await Role.findByPk(roleId,{
            attributes: { exclude: ['createdAt', 'updatedAt','deletedAt'] } // Exclure les champs createdAt et updatedAt..
        });
        if (!role) {
            return res.status(404).json({message: 'Role not found'});
        }
        return res.json({message:"Role fetch Successfully",data:role});
    } catch (err) {
        console.error(err.message || "Internal server error");
        return res.status(500).json({ message: 'Failed to fetch role' });
        res.status(500).send('Erreur serveur');
    }
};


const updateRole = async (req, res) => {
    let roleId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!roleId) {
        return res.status(400).json({ msg: 'Missing parameter' })
    }

    try {
        let role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        
        const roleDetails = {
            id: roleId,
            name: req.body.name,
        };
         await Role.update(roleDetails, { where: { id: roleId } });
         
        return res.json({ message: 'Role was updated successfully', data:roleDetails } );
    } catch (err) {
        console.error(err.message || 'Erreur serveur');
        return res.status(500).json({ message: 'Failed to update role' });
    }
};


const deleteRole = async (req, res) => {

    let roleId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!roleId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    try {
        let existingRole = await Role.findByPk(roleId);
        if (!existingRole) return res.status(404).json({message: 'Role not found'});

        await Role.destroy({ where: { id: roleId }, force: true });
        return res.status(204).json({message: 'Role deleted sucessfully'})
    } catch (err) {
        console.error(err.message || 'Erreur serveur');
        return res.status(500).json({ message: 'Failed to delete role' });
    }
};


// Delete all roles from the database.
const deleteAllRole = async (req, res) => {
    try {
       await Role.destroy({
        where: {},
        truncate: false
      });
  
      return res.status(204).json({
        message: "All roles were deleted successfully!"
      });
    } catch (err) {
        console.log(err.message)
      return res.status(500).json({
        message:"Some error occurred while removing all categories."
      });
    }
};



  

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    deleteAllRole
};
