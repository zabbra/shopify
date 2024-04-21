const { body, validationResult } = require('express-validator');


const validateUser = [
    body('username').not().isEmpty().withMessage('username does not Empty'),
    body('email')
    .isEmail().normalizeEmail()
    .withMessage('Invalid Email')
    .exists(),
    body('password').isLength({ min: 8 })
    .withMessage('password must be at least 8 characters')
    .isLength({ max: 30 })
    .withMessage('password must be at max 30 chars long')
    .matches(/\d/)
    .withMessage('password must contain a number')
    .exists(),

    
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




module.exports = validateUser;