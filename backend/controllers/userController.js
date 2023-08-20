const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)
    console.log(user._id);
    res.status(200).json({email, token,user_id:user._id})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}
// signup a user
const signupUser = async (req, res) => {
  const {firstname,lastname,username,email, password} = req.body

  try {
    const user = await User.signup(firstname,lastname,username,email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token,user_id:user._id})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}
//get user
const getUser=async(req,res)=>{
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


module.exports = { signupUser, loginUser,getUser }