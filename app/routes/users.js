var express = require('express');
var router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

router.post('/register', async (req, res) =>{
    const { name, email, password } = req.body;
    const user = new User({name, email, password})

    try{
      await user.save();
      res.status(200).json(user);
    } catch (error){
      res.status(500).json({error: 'Error registering new user'});
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
      let user = await User.findOne({ email });
      if(!user){
        return res.status(401).json({error: 'User not found'});
      } else{
        user.isCorrectPassword(password, function(err, same){
          if(!same){
            return res.status(401).json({error: 'Incorrect password'});
          } else{
            const token = jwt.sign({email}, secret, {expiresIn: '1d'});
            res.json({user: user, token: token});
          }
        })
      }
    } catch(error){
      res.status(500).json({error: 'Error logging in'});
    }
})

router.all('/all', (req, res) => {
  User.find({}, (err, users) => {
    if(err) {
      res.status(500).json({error: 'Internal error, please try again'});
    } else {
      res.json(users);
    }
  })
})

module.exports = router;
