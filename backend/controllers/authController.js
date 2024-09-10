import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { User } from '../models/userModel.js';

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: 'fail',
        message: 'All fields are required!',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: 'fail',
        message: 'Invalid Email!',
      });
    }

    if (password.length < 6) {
      res.status(400).json({
        success: 'fail',
        message: 'Password must be at least 6 characters!',
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: 'fail',
        message: 'Email already exists!',
      });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: 'fail',
        message: 'Username already exists!',
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      image,
    });

    // await newUser.save();
    newUser.password = '';

    res.status(201).json({
      success: 'true',
      message: 'User created successfully!',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log('🚀🚀🚀error in signup controller=', error.message);
    res.status(500).json({
      success: 'fail',
      message: 'Internal server error!',
    });
  }
};

export const login = async (req, res) => {
  res.send('LOGIN ROUTE!');
};

export const logout = async (req, res) => {
  res.send('LOGOUT ROUTE!');
};
