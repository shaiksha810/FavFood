const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/auth.model')
const jwt = require('jsonwebtoken');



const foodPartnerMiddleware = async (req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Please Login First"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if(!foodPartner){
            return res.status(401).json({
                message:"foodPartner not found"
            })
        }

        req.foodPartner = foodPartner;

        next()

    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}


const userMiddleware = async (req,res,next) => {
    const token = req.cookies.token;

        if(!token){
        return res.status(401).json({
            message:"Please Login First"
        })
    }


     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                message:"user not found"
            })
        }

        req.user = user;

        next()

    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }

} 


module.exports = {
    foodPartnerMiddleware,
    userMiddleware
}