const db = require("../models");
const Category = db.category;
const fs = require('fs');
const path = require('path');



// Create and Save a new category
const createCategory = async(req,res) =>{

    try {
        
        const { name, description} = req.body;
        const imageFile= req.file; // Récupérer l'objet de fichier de la requête
        const thumbnail = imageFile.filename; // Chemin relatif vers l'image téléchargée
        
        
        // Vérification si la catégorie existe déjà
        const existingCategory = await Category.findOne({ where: {name}, raw: true });
        if (existingCategory !== null) {
            return res.status(409).json({ message: `The category ${name} already exists !` });
        }

       
        /// Create a category
        // Save category in the database
        const newCategory = await Category.create({
            name,
            description,
            thumbnail
        });
        
        res.status(201).json({ message: 'Category was Created successfuly', data: newCategory });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            message: "Some error occurred while creating the category."
        });
    }


};


// Retrieve all categories from the database.
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt','deletedAt'] } 
        });
        res.json({data:categories});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            message: "Some error occurred while creating the category."
        });
    }
};


// Find a single category with an id
const getCategoryById = async (req, res) => {
    const categoryId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!categoryId) {
        return res.status(400).json({ message: 'Missing Parameter' })
    }
    try {
        const existingCategory = await Category.findByPk(categoryId,{
            attributes: { exclude: ['createdAt', 'updatedAt','deletedAt'] } // Exclure les champs createdAt et updatedAt..
        });
        if (!existingCategory) {
            return res.status(404).json({message: `Not found category with id ${categoryId}`});
        }
        return res.json({message:"Category was fecth Successfully",data:existingCategory});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: `Error retrieving category with id ${categoryId}`});
    }
};


// Update a category by the id in the reques
const updateCategory = async (req, res) => {

    /*if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
    }*/
    let categoryId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!categoryId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try {
        let existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ 
                message: `Cannot update category with id=${categoryId}. Maybe category was not found!` 
            });
        }
        
        const { name, description } = req.body;
        let thumbnail = existingCategory.thumbnail; // Garder l'ancien nom de l'image par défaut

        // Vérifier si une nouvelle image est fournie dans la requête
        if (req.file) {
            // Supprimer l'ancienne image du système de fichiers
            const imagePath = path.join(__basedir, '/', 'uploads', existingCategory.thumbnail);
            try {
                await fs.promises.unlink(imagePath);
            } catch (error) {
                console.error(`Erreur lors de la suppression de l'ancienne image ${existingCategory.thumbnail}`, error);
            }
            
           
            // Mettre à jour le nom de la nouvelle image
            thumbnail = req.file.filename;

            // Télécharger la nouvelle image dans le dossier de téléchargement
            const newImagePath = path.join(__basedir, '/', 'uploads', thumbnail);

            //await fs.promises.writeFile(newImagePath, req.file.buffer);
        }

        // Mettre à jour les champs de la catégorie
        const categoryDetails = {
            id: categoryId,
            name,
            description,
            thumbnail
        };

        await Category.update(categoryDetails, { where: { id: categoryId } });
         
        return res.json({ message: 'category was updated successfully', data:categoryDetails } );
    } catch (err) {
        console.error(err.message ||  `Error updating category  with id ${categoryId}`);
        return res.status(500).send({
            message: `Error updating category  with id ${categoryId}`
        });
    }
};


// Delete a category with the specified id in the request
const deleteCategory = async (req, res) => {

    let categoryId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!categoryId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    try {
        let existingCategory = await Category.findByPk(categoryId);
        if (!existingCategory){
            return res.status(404).json({
                message: `Cannot delete category with id=${categoryId}. Maybe category was not found!`
            });
        } 

        

        // Chemin complet vers le fichier image a supprimer
        const imagePath = path.join(__basedir, '/', 'uploads', existingCategory.thumbnail);
        try {
            // Vérifier si le fichier existe avant de le supprimer
            imagePath && await fs.promises.access(imagePath, fs.constants.F_OK);
            // Supprimer le fichier image associé à la catégorie
            imagePath && await fs.promises.unlink(imagePath);
            console.log(`Image ${existingCategory.thumbnail} supprimée avec succès`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'image ${existingCategory.thumbnail}`, error);
        }
        
        await Category.destroy({ where: { id: categoryId }, force: true });
        //fs.unlinkSync(imagePath);

        return res.status(204).json({message: 'Category was deleted sucessfully'})
    } catch (err) {
        console.error(err.message || "Could not delete Tutorial with id= " + categoryId);
        res.status(500).send({
            message:`Could not delete Category with id ${categoryId}`
        });
    }
};

// Delete all categories from the database.
const deleteAllCategory = async (req, res) => {
    try {
        // Récupérer toutes les catégories avec les chemins des images associées
        const categories = await Category.findAll({ attributes: ['id','name', 'thumbnail'] });

        // Supprimer toutes les catégories
        await Category.destroy({ where: {}, truncate: false });

        // Supprimer les images associées
        categories.forEach(async (category) => {
            const imagePath = path.join(__basedir, '/', 'uploads', category.thumbnail);
            try {
                // Vérifier si le fichier existe avant de le supprimer
                await fs.promises.access(imagePath, fs.constants.F_OK);
                await fs.promises.unlink(imagePath);
                console.log(`Image ${category.thumbnail} supprimée avec succès`);
            } catch (error) {
                console.error(`Erreur lors de la suppression de l'image ${category.thumbnail}`, error);
            }
        });
        console.log("Toutes les catégories ont été supprimées avec succès, ainsi que leurs images associées")
        return res.send({
            message: "Categories were deleted successfully!"
        });
    } catch (err) {
        console.error(err.message || 'Erreur lors de la suppression de toutes les catégories');
        console.error('Une erreur s\'est produite lors de la suppression de toutes les catégories')
        res.status(500).send({ 
            message: "Some error occurred while removing all categories."
         });
        
    }
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteAllCategory
};
