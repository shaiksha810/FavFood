const foodPartnerModel = require('../models/foodPartner.model');
const foodModel = require('../models/food.model')


const getFoodPartnerById = async (req,res) => {

    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById({_id:foodPartnerId});
    const foodItemsByFoodPartner = await foodModel.find({foodPartner:foodPartnerId})
    
    if(!foodPartner){
        return res.status(404).json({
            message:"food partner not found"
        })
    }


    res.status(200).json({
        message:"food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems:foodItemsByFoodPartner
        }
    })

}




module.exports = {
    getFoodPartnerById
}