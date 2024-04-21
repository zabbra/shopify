const { body, validationResult } = require('express-validator');
const validateImage = require("./validateImage")

const validateProduct = [
    body('title').notEmpty().withMessage('Le titre du produit est requis'),
    body('description').notEmpty().withMessage('La description du produit est requise'),
    body('price').isFloat({ min: 0 }).withMessage('Le prix du produit doit être un nombre positif'),
    body('stock').isInt({ min: 0 }).withMessage('Le stock du produit doit être un entier positif'),
    //...validateImage,
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = {};
            errors.array().forEach(error => {
                formattedErrors[error.path] = error.msg;
            });
            return res.status(400).json({ success: false, errors: formattedErrors });
            //return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];




module.exports = validateProduct;