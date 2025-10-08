const express = require('express');
const foodMiddleware = require('../middleware/auth.middleware')
const foodController = require('../controllers/food.controller');
const multer = require("multer");
const router = express.Router();


const upload = multer({
    storage:multer.memoryStorage(),
})

router.post('/',
    upload.single("video"), 
    foodMiddleware.foodPartnerMiddleware, 
    foodController.createFood
);

router.get('/',
    foodMiddleware.userMiddleware, 
    foodController.getFoodItems)


router.post('/like', 
    foodMiddleware.userMiddleware, 
    foodController.likeFood)


router.post('/save', 
    foodMiddleware.userMiddleware,
    foodController.saveFood)

router.get('/saved', 
    foodMiddleware.userMiddleware,
    foodController.getSavedFoods)

module.exports = router;