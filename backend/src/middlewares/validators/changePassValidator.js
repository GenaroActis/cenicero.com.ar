import { check, validationResult } from 'express-validator'

export const validateChangePass = [
    check('email', 'InvalidEmail')
        .exists()
        .isEmail(),
    check('newPassword', 'VeryShort')
        .exists()
        .not()
        .isEmpty()
        .isLength({min:6}),
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