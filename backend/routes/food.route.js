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

//like route
router.post('/like', 
    foodMiddleware.userMiddleware, 
    foodController.likeFood)

//save routes
router.post('/save', 
    foodMiddleware.userMiddleware,
    foodController.saveFood)

router.get('/saved', 
    foodMiddleware.userMiddleware,
    foodController.getSavedFoods)


//comments routes
router.post("/addcomment",
    foodMiddleware.userMiddleware, 
    foodController.addComment)


router.get("/:foodId/comments",
    foodMiddleware.userMiddleware, 
    foodController.getComments);


module.exports = router;