const foodModel = require("../models/food.model");
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const userModel = require('../models/auth.model');
const commentModel = require('../models/comment.model')

const { v4: uuid } = require('uuid');


const createFood = async (req, res) => {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
    // console.log(fileUploadResult);

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    });

    console.log(foodItem);

    res.status(201).json({
        message: "foodItem created successfully",
        food: foodItem
    })
}

const getFoodItems = async (req, res) => {
    const userId = req.user._id;

    const foods = await foodModel.find().lean();

    const likedFoods = await likeModel.find({ user: userId }).select("food");
    const likedSet = new Set(likedFoods.map(l => l.food.toString()));

    const savedFoods = await saveModel.find({ user: userId }).select("food");
    const savedSet = new Set(savedFoods.map(s => s.food.toString()));

    const response = foods.map(food => ({
        ...food,
        isLikedByUser: likedSet.has(food._id.toString()),
        isSavedByUser: savedSet.has(food._id.toString()),
        likeCount: food.likeCount || 0,
        savesCount: food.savesCount || 0
    }));

    res.json({ foodItems: response });
};


const getAllFoods = async (req, res) => {
    try {
        const { id } = req.body;  // extract id from body

        // query your foodModel where partnerId (or similar field) matches
        const allFoods = await foodModel.find({ foodPartner: id });

        console.log("Foods found:", allFoods);
        res.status(200).json(allFoods); // send back to frontend
    } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const likeFood = async (req, res) => {
    const { foodId } = req.body;
    const userId = req.user._id;

    const isAlreadyLiked = await likeModel.findOne({ user: userId, food: foodId });

    let isLiked;

    if (isAlreadyLiked) {
        // Unlike
        await likeModel.deleteOne({ user: userId, food: foodId });
        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { likeCount: -1 } },
            { new: true } // return updated doc
        );
        isLiked = false;

        return res.status(200).json({
            message: "Food Unliked Successfully",
            isLiked,
            likeCount: updatedFood.likeCount
        });
    }

    // Like
    await likeModel.create({ user: userId, food: foodId });
    const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: 1 } },
        { new: true }
    );
    isLiked = true;

    return res.status(201).json({
        message: "Food Liked Successfully",
        isLiked,
        likeCount: updatedFood.likeCount
    });
}

const saveFood = async (req, res) => {
    const { foodId } = req.body;
    const userId = req.user._id;
    // console.log(foodId,userId);
    

    const existingSave = await saveModel.findOne({ user: userId, food: foodId });

    let isSaved;

    if (existingSave) {
        // Unsave
        await saveModel.deleteOne({ user: userId, food: foodId });
        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { savesCount: -1 } },
            { new: true }
        );
        isSaved = false;
        return res.json({
            message: "Food unsaved",
            isSaved,
            savesCount: updatedFood.savesCount
        });
    }

    // Save
    await saveModel.create({ user: userId, food: foodId });
    const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { savesCount: 1 } },
        { new: true }
    );
    isSaved = true;

    return res.json({
        message: "Food saved",
        isSaved,
        savesCount: updatedFood.savesCount,
    });
}

// GET /api/food/saved
const getSavedFoods = async (req, res) => {
  try {
    const userId = req.user._id; // JWT middleware se user mil gaya
    const savedItems = await saveModel.find({ user: userId }).populate("food");
    res.status(200).json(savedItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved foods", error });
  }
}


const addComment = async (req, res) => {
  try {
    const { foodId, text } = req.body;

    // Validate input
    if (!foodId || !text?.trim()) {
      return res.status(400).json({ message: "foodId and text are required" });
    }

    const userId = req.user._id;

    // Optional: ensure food exists
    const foodExists = await foodModel.findById(foodId);
    if (!foodExists) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Create comment
    let newComment = await commentModel.create({
      food: foodId,
      user: userId,
      text: text.trim(),
    });

    // Populate user details for frontend display
    newComment = await newComment.populate("user");

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// ➤ Get All Comments of a Food Item
const getComments = async (req, res) => {
  try {
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const comments = await commentModel
      .find({ food: foodId })
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};


module.exports = {
    createFood,
    getFoodItems,
    getAllFoods,
    likeFood,
    saveFood,
    getSavedFoods,
    addComment,
    getComments
};