import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';



export const signup = async (req, res) => {
    const{fullName, email, password} = req.body
  try {
    if(!fullName || !email || !password){
        return res.status(400).send({message: 'Please provide all required fields'});
    }
    
    if(password.length < 6){
        return res.status(400).send({message: 'Password must be at least 6 characters long'});
    }

    const user = await User.findOne({email});
    if(user){
        return res.status(400).send({message: 'User already exists'});
    }

    //hash password using bcrypt 123456 => fkndinslkni2n3n4oi to encrypt the paswword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
    });
    if(newUser){
        //generate jwt token here
        generateToken(newUser._id, res);
        await newUser.save();
        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    }else{
        return res.status(400).json({message: 'Error creating user'});
    }


  } catch (error) {
    console.error('Error during signup:', error.message );
    return res.status(500).json({message: 'Server error'});
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    if(!email || !password){
        return res.status(400).send({message: 'Please provide all required fields'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).send({message: 'Invalid email or password'});
    }   

    const isPasswordCorrect = await bcrypt.compare(password, user.password,);
    if(!isPasswordCorrect){
        return res.status(400).send({message: 'Invalid email or password'});
    }
    
    //generate jwt token here
    generateToken(user._id, res);

    return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
    });
  }

  catch (error) {
    console.error('Error during login:', error.message );
    return res.status(500).json({message: 'Server error'});
  }
};

export const logout = async(req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: 'Logged out successfully'});
  } catch (error) {
    console.error('Error during logout:', error.message );
    return res.status(500).json({message: 'Server error'});
  }
};

export const updateProfile = async (req, res) => {
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message: 'Profile picture is required'});
    }

    const uploadResponse =  await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {profilePic: uploadResponse.secure_url},
      {new: true} 
    );

    if(!updatedUser){
      return res.status(404).json({message: 'User not found'});
    }

    return res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    }); 
  }
  catch (error) {
    console.error('Error during profile update:', error.message );
    return res.status(500).json({message: 'Server error'});
  } 
};

export const checkAuth = async (req, res) => { 
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error during auth check:', error.message );
    return res.status(500).json({message: 'Server error'});
  }
};