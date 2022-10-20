const router=require('express').Router();
const mongoose=require('mongoose');
const User=require('../models/User');

const { StatusCodes } = require('http-status-codes');
const isLoggedIn=require('../middleware/is-logged-in');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');

const logIn=async (email, password) => {
    const users = await User.find();
    const user= users.find((user)=>{
        return user.email===email;
    });

    //if user found, check password. if not, status code unauthorized
    if (user) {
        const result = bcrypt.compareSync(password, user.password);

        if (result) {
            //user is authenticated, send a token
            return jwt.sign({
                _id:user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                department: user.department,
                phone: user.phone
            }, user.secret);
        }
    }


    return false;
};

router.post('',async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email + password);

    if (email && password) {
        const token = await logIn(email, password);
        console.log(token);
        if (token) {
            res.send({token: token});

        } else {
            res.status(StatusCodes.UNAUTHORIZED).send('credentials incorrect!');
        }

    } else {
        res.status(StatusCodes.BAD_REQUEST).send('Required parameters missing!');
    }



});

module.exports=router;

