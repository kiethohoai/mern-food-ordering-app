import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { User } from '../models/userModel.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

// todo SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required!',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email!',
      });
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters!',
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists!',
      });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists!',
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = await User({
      username,
      email,
      password: hashPassword,
      image,
    });

    // Get token
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    // Remove password from respone
    newUser.password = '';
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log('🚀🚀🚀error in signup controller=', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
    });
  }
};

// todo LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required!',
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      message: 'Logged in successfuly',
      user: {
        ...user._doc,
        password: '',
      },
    });
  } catch (error) {
    console.log('🚀🚀🚀Error in login controller =', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
    });
  }
};

// todo LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt-netflix');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully!',
    });
  } catch (error) {
    console.log('🚀🚀🚀Error in logout controller =', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
    });
  }
};
