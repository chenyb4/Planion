const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Booking=require('../models/Booking');
const isLoggedIn=require('../middleware/is-logged-in');
const {ObjectId} = require("mongodb");
const {StatusCodes} = require("http-status-codes");

//get all bookings ---tested
router.get('',isLoggedIn,async (req, res) => {
    try {
        const bookings =  await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.json({message:err})
    }
});


//get one booking by id
router.get('/:id',isLoggedIn,async (req, res) => {

    try {
        const id = req.params.id;
        const ObjectId = require('mongodb').ObjectId;
        const bookings =  await Booking.find({_id: new ObjectId(id)});
        res.status(StatusCodes.ACCEPTED).send(bookings);
    } catch (err) {
        res.json({message:err});
    }
});

//post a new booking --tested
router.post('', isLoggedIn, async (req, res) => {
    const booking = new Booking({
        userEmail: req.body.userEmail,
        shiftDate: req.body.shiftDate,
        isMorningShift: req.body.isMorningShift
    });
    await booking.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({message: err});
        });
});



//change info of a booking --tested
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const updatedBooking = await Booking.updateOne(
            {_id: req.params.id},
            {
                $set: {userEmail: req.body.userEmail},
                $set: {shiftDate: req.body.shiftDate},
                $set: {isMorningShift: req.body.isMorningShift}
            }
        );
        res.json(updatedBooking);
    } catch (err) {
        res.send({message: err});
    }

});

//delete a booking --tested
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const removedBooking = await Booking.remove({_id: req.params.id});
        res.json(removedBooking);
    } catch (err) {
        res.send({message: err});
    }
});


module.exports=router;
