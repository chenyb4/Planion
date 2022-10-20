const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../models/User');
const {v4:uuidv4}=require('uuid');
const bcrypt = require("bcrypt");
const jwt =require('jsonwebtoken');
const {StatusCodes} = require("http-status-codes");
const {ObjectId} = require("mongodb");

//get all users --tested
router.get('/',async (req, res) => {

    const { department } = req.query;

    try{
        const users=await User.find();
        let resultUsers=users;
        if(department){
            resultUsers=resultUsers.filter((user)=>{
                return user.department==department;
            });
        }
        if (resultUsers == []){
            res.status(StatusCodes.NOT_FOUND).send(`Cannot find product with ending date: ${endingDate}`)
        }else{
            res.status(StatusCodes.OK).send(resultUsers);
        }

    }catch (err){
        res.json({message:err})
    }

});


//get one user by email
router.get('/:email',async (req, res) => {

    const email=req.params.email;


    try{
        const users=await User.find({email: email});

        if (users == []){
            res.status(StatusCodes.NOT_FOUND).send(`Cannot find user with email: ${email}`)
        }else{
            res.status(StatusCodes.OK).send(users);
        }

    }catch (err){
        res.json({message:err})
    }

});




//post a new user ---tested
router.post('',(req, res) => {

    const salt=bcrypt.genSaltSync(10);

    const user=new User({
         name:req.body.name,
          role:['employee'],
          department:req.body.department,
          phone:req.body.phone,
         email:req.body.email,
          password:bcrypt.hashSync(req.body.password,salt),
          secret:uuidv4()
      });
      user.save()
          .then(data=>{
             res.json(data);
          })
          .catch(err=>{
             res.json({message:err});
          });
});

//change info of a user ---tested
router.patch('/:email',async (req, res) => {
    const salt=bcrypt.genSaltSync(10);
    try {
        const updatedUser = await User.updateOne(
            {email: req.params.email},
            {
                $set: {name: req.body.name},
                $set: {department: req.body.department},
                $set: {phone: req.body.phone},
                $set: {password:bcrypt.hashSync(req.body.password,salt)}
            }
        );
        res.json(updatedUser);
    } catch (err) {
        res.send({message: err});
    }
});

//delete a user ---tested
router.delete('/:email', async (req, res) => {
    try {
        const removedUser = await User.remove({email: req.params.email});
        res.json(removedUser);
    } catch (err) {
        res.send({message: err});
    }
});

module.exports=router;
