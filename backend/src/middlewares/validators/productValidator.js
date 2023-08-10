import { check, validationResult } from 'express-validator'

export const validateCreateProduct = [
    check('title', 'VeryLong')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:25}),
    check('description')
        .exists()
        .not()
        .isEmpty(),
    check('price')
        .exists()
        .not()
        .isEmpty()
        .isNumeric(),
    check('stock')
        .exists()
        .not()
        .isEmpty()
        .isNumeric(),
    check('category')
        .exists()
        .not()
        .isEmpty(),
    check('size')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            return next()
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    }
];