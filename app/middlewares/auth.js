require('dotenv').config();
const secret = process.env.JWT_TOKEN;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const WithAuth = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).json({error: 'Unauthorized'});
    }else{
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                return res.status(401).json({error: 'Token invalid'});
            } else{
                req.email = decoded.email;
                User.findOne({email: decoded.email})
                .then(user => {
                    req.user = user;
                    next();
                }).catch(err => {
                    res.status(401).json({error: err});
                })
            }
        });
    }
}

module.exports = WithAuth;