import { validationResult } from "express-validator";
import { body } from "express-validator";


// Middleware to validate request and handle errors

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// This is an specific validation rules for auth login and signup routes 

//Signup validation rules
export const SignupValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    
];

//Login validation rules
export const LoginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    
];