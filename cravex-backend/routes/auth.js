import express from 'express'
const app = express()
const router = express.Router();

import { validate, SignupValidation, LoginValidation } from '../middleware/validate.js';
import { SignupUser, LoginUser, checktoken } from '../controllers/authController.js';
import { authmiddleware } from '../middleware/auth.js';

router.post('/signup',SignupValidation,validate,SignupUser);
router.post('/login',LoginValidation,validate,LoginUser);
router.get('/check-token',validate,checktoken);

router.get("/profile", authmiddleware, (req, res) => {
    res.json({ message: "Welcome to your profile", user: req.user });
});


export default router;

