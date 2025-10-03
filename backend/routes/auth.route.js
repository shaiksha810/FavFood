const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');


const router = express.Router();

//user APIs
router.post('/user/login', authController.userLogin); // middleware remove
router.post('/user/register', authController.userRegister); // middleware remove
router.get('/user/logout', authMiddleware.userMiddleware, authController.userLogout); // middleware allowed

//food-partner APIs
// Food-partner APIs
router.post('/food-partner/register', authController.foodPartnerRegister); // middleware removed
router.post('/food-partner/login', authController.foodPartnerLogin);       // middleware removed
router.get('/food-partner/logout', authMiddleware.foodPartnerMiddleware, authController.foodPartnerLogout); // middleware OK

module.exports = router;