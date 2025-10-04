const foodPartnerModel = require('../models/foodPartner.model');
const foodModel = require('../models/food.model');

const getFoodPartnerById = async (req, res) => {
  try {
    const foodPartnerId = req.params.id;

    // ✅ Fix: pass string id directly
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
      return res.status(404).json({
        message: "Food partner not found",
      });
    }

    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

    res.status(200).json({
      message: "Food partner retrieved successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner,
      },
    });
  } catch (err) {
    console.error("🔥 getFoodPartnerById error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  getFoodPartnerById,
};
