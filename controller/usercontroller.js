import User from '../models/usermodel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generatetoken.js';

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body
  console.log(name, email, password);
  //valiadtion
  if (!name || !email || !password) {
    res.status(400)
    const err = new Error("Please Provide name,email,password");
    return next(err)
  }

  if (password.length < 8) {
    res.status(400)
    const err = new Error("password must be atleast 8 charecter");
    return next(err)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400)
    const err = new Error("Invaild email address ");
    return next(err)
  }

  try {
    // const userExists = await User.findOne({ email });
    // if (userExists) {
    //   res.status(400);
    //   const err = new Error(
    //     "Email is already has been registerd .Please use a differnt email address"
    //   );
    //   return next(err);
    // }
    // hash logic
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
      // res.send("created successfully")
    }

  } catch (error) {
    console.log(11000);
    if (error.code === 11000) {
      res.status(400);
      const err = new Error(
        "Email has been register please find differnt email address"
      );
      return next(err);
    }

    res.status(500).json({ error: error.message } || "Internal server Error")
  }
};
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.checkPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
   // res.send("ok")
  } else {
    res.status(400);

    throw new Error("Invalid email or password")
  }
  console.log(email, password);
 // res.send("ok");
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "Logged Out.." })
});

const getProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user)
});

const updateProfile = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (password.length < 8) {
    res.status(400)
    throw new Error("password must be atleast 8 charecter");
   
  }
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    if (password) {
      user.password = password;
    }
    const updateUser = await user.save();
    res.status(200).
      json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
      });
  } else {
    res.status(404);
    throw new Error("User not found")
  }

});
export { createUser, login, logout, getProfile, updateProfile };