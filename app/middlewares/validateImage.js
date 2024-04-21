const { body, validationResult } = require('express-validator');

const validateImage = [
    body('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Veuillez télécharger une image');
        }
        // Vérifier si le fichier est bien une image
        if (!req.file.mimetype.startsWith('image')) {
            throw new Error('Le fichier téléchargé doit être une image');
        }
        // Vérifier la taille de l'image (par exemple, 5 Mo)
        if (req.file.size > 5 * 1024 * 1024) {
            throw new Error('La taille maximale de l\'image est de 5 Mo');
        }
        return true;
    }),
    /*(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }*/
];

module.exports = validateImage;
