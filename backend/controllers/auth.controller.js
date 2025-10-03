const userModel = require('../models/auth.model');
const foodPartnerModel = require('../models/foodPartner.model');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

//user controllers
const userRegister = async (req,res) => {
    const {fullName, email, password} = req.body;
    
    const isUserAlreadyExists = await userModel.findOne({ email });

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists"
        })
    };


    const hashedPassword = await argon2.hash(password);

    const newUser = await userModel.create({
        fullName,
        email,
        password:hashedPassword
    });


    const token = jwt.sign({
        id:newUser._id,
    },process.env.JWT_SECRET);


    res.cookie("token", token);

    res.status(201).json({
        message:"user register successfully",
        newUser:{
            _id:newUser._id,
            email:newUser.email,
            fullName:newUser.fullName
        }
    });

};

const userLogin = async (req,res) => {
    const { email, password } = req.body;
    console.log(email,password);
    
    
    const user = await userModel.findOne({ email });

    if(!user) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    };

    const isPasswordValid = await argon2.verify(user.password, password);

    
    if(!isPasswordValid) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    };

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);



    res.status(200).json({
        message:"user logged in successfully",
        newUser:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    });

};

const userLogout = (req,res) => {
    res.clearCookie("token");
    res.status(200).json({
        message:'user logged out successfully'
    })
}


//foodPartner controllers
const foodPartnerRegister = async (req,res) => {
    const {name, email, password, phone, contactName, address} = req.body;
    
    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message:"Account already exists"
        })
    };


    const foodPartnerhashedPassword = await argon2.hash(password);

    const newFoodPartner = await foodPartnerModel.create({
        name,
        email,
        password:foodPartnerhashedPassword,
        phone,
        address,
        contactName
    });


    const token = jwt.sign({
        id:newFoodPartner._id,
    },process.env.JWT_SECRET);


    res.cookie("token", token);

    res.status(201).json({
        message:"foodPartner register successfully",
        newFoodPartner:{
            _id:newFoodPartner._id,
            email:newFoodPartner.email,
            name:newFoodPartner.name,
            phone:newFoodPartner.phone,
            contactName:newFoodPartner.contactName,
            address:newFoodPartner.address
        }
    });

};

const foodPartnerLogin = async (req,res) => {
    const { email, password } = req.body;
    
    const foodPartner = await foodPartnerModel.findOne({ email });

    if(!foodPartner) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    };

    const isPasswordValid = await argon2.verify(foodPartner.password, password);

    
    if(!isPasswordValid) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    };

    const token = jwt.sign({ id:foodPartner._id }, process.env.JWT_SECRET);
    res.cookie("token", token);



    res.status(200).json({
        message:"foodPartner logged in successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            name:foodPartner.name
        }
    });

};

const foodPartnerLogout = (req,res) => {
    res.clearCookie("token");
    res.status(200).json({
        message:'foodPartner logged out successfully'
    })
}





module.exports = {
    userRegister,
    userLogin,
    userLogout,
    foodPartnerRegister,
    foodPartnerLogin,
    foodPartnerLogout

}