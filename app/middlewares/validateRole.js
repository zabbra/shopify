const { body, validationResult } = require('express-validator');


const validateRole = [
    body("name").notEmpty().trim().withMessage('Le nom du role est requis'),
  
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




module.exports = validateRole;