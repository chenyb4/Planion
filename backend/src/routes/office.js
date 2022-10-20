const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Office=require('../models/Office');

//get all offices --tested
router.get('',(req, res) => {
    res.send("we will implement it later");
    const office=new Office(mongoose.Schem)
    office.get()
        .then(data=>{
            res.json(data);
        })
});

//change info of a office ---tested
router.patch('',async (req, res) => {
    try {
        const updatedOffice = await Office.updateOne(
            {_id: '6154c6e4b92a8605d7415aed'},
            {
                $set: {maxNrOfPeopleAllowed: req.body.maxNrOfPeopleAllowed}
            }
        );
        res.json(updatedOffice);
    } catch (err) {
        res.send({message: err});
    }
});

module.exports=router;
