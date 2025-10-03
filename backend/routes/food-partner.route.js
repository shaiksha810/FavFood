const express = require('express')
const authMidlleware = require('../middleware/auth.middleware')
const foodPartnerController = require('../controllers/food-partner.controller')
const router = express.Router();




router.get('/:id', authMidlleware.userMiddleware, foodPartnerController.getFoodPartnerById)


module.exports = router;