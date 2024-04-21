const db = require("../models");
const Category = db.category
const Product = db.product
const Image = db.image



// Récupérer tous les produits avec leurs images et catégories associées
const getAllProductsWithImages = async (req, res) => {
    try {
        const productsWithImagesAndCategories = await Product.findAll({
            attributes: { exclude: ['categoryId','createdAt', 'updatedAt','deletedAt'] } ,
            include: [
                { 
                    model: Category, 
                    as: 'category',
                    attributes: { exclude: ['createdAt', 'updatedAt','deletedAt'] }
                },
                { model: Image, as: 'images' }
            ]
        });

        // Mapper les produits pour créer la structure demandée
        const formattedProducts = productsWithImagesAndCategories.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            brand: product.brand,
            category: product.category ? product.category.name : null,
            thumbnail: product.thumbnail,
            images: product.images.map(image => image.url)
        }));
        return res.json({data:formattedProducts});
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Erreur serveur');
    }
};

// Créer un nouveau produit avec une image
const createProductWithImage = async (req, res) => {
    try {

        const { title, description, price, rating,discountPercentage,stock,brand,categoryId } = req.body;
        const imageFile= req.file; 
        const thumbnail = imageFile.filename; 


        const existingCategory = await Category.findOne({ where: {id: categoryId }, raw: true });

        if (!existingCategory) {
            return res.status(409).json({ message: `The category ${categoryId} do not exists !` });
        }

        // Création du produit
        const newProduct = await Product.create({ 
            title, 
            description, 
            price, 
            stock,
            brand,
            rating,
            discountPercentage,
            categoryId:existingCategory.id,
            thumbnail
        });

        // Création de l'image associée au produit
        /*const newImage = await Images.create({
            imageUrl: imageFile.path, // Chemin d'accès à l'image sur le serveur
            productId: newProduct.id // ID du produit associé à cette image
        });*/
        return res.status(201).json({ message: 'Produit créé avec succès', data: newProduct });

    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Erreur serveur');
    }
};

// Récupérer un produit par son identifiant (ID)
const getProductById = async (req, res) => {

    const productId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!productId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }


    
    try {

        // Rechercher le produit par ID avec son image associée
        //const product = await Products.findAll({ where: { id: postId } })
        const product = await Product.findByPk(productId, {
            attributes: { exclude: ['cartId','createdAt', 'updatedAt','deletedAt'] } ,
            include:[
                {
                    model: Category,
                    as: 'category',
                    attributes: { exclude: ['createdAt', 'updatedAt','deletedAt'] } ,
                    
                },
                { model: Image, as: 'images' }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        const productDetails = {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            brand: product.brand,
            category: product.category.name,
            thumbnail: product.thumbnail,
            images: product.images.map(image => image.url)
        };
       
        return res.json({data:productDetails});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Mettre à jour un produit existant avec une nouvelle image
const updateProductWithImage = async (req, res) => {
    const productId = parseInt(req.params.id);
    const productData = req.body;
    //const imageFile = req.file;

    // Vérification si le champ id est présent et cohérent
    if (!productId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    
    try {
        
        const existingProduct = await Product.findByPk(productId);
        console.log(existingProduct )

        if (!existingProduct) {
            return res.status(404).json({ message: 'This product does not exist !' })
        }

        const productDetails = {
            id: productId,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            discountPercentage: productData.discountPercentage,
            rating: productData.rating,
            stock: productData.stock,
            brand:productData.brand,
            category: productData.category ? productData.category.name : null,
            thumbnail: productData.thumbnail,
            //images: product.images.map(image => image.url)
        };
        // Mettre à jour les informations du produit
         await Product.update(productDetails, { where: { id: productId } });

         // Supprimer toutes les images associées au produit
        //await Image.destroy({ where: { productId } });

        // Créer une nouvelle image associée au produit
        //if (imageFile) {
            //const newImage = await Image.create({
                //imageUrl: imageFile.path, // Chemin d'accès à l'image sur le serveur
                //productId // ID du produit associé à cette image
            //});
        //}
        //res.json({ message: 'Produit mis à jour avec une nouvelle image' });
        return res.json({ message: 'Product updated sucessfully' })
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};


// Supprimer un produit existant
const deleteProductWithImage = async (req, res) => {
    const productId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!productId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    try {
        let existingProduct = await Product.findByPk(productId);
        // Supprimer le produit par ID avec toutes ses images associées
        if (!existingProduct) return res.status(404).json({ message: 'This Product does not exist!' });

        await Product.destroy({ where: { id: productId }, force: true });
        //await Image.destroy({ where: { productId } });
         
        return res.status(204).json({ message: 'Product deleted sucessfully' });
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Erreur serveur');
    }
};

module.exports = {
    getAllProductsWithImages,
    createProductWithImage,
    getProductById,
    updateProductWithImage,
    deleteProductWithImage
};