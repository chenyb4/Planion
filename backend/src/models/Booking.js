const mongoose=require('mongoose');

const BookingSchema=mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    },
    shiftDate:{
        type:Date,
        required:false
    },
    isMorningShift:{
        type: Boolean,
        required: true
    }
});

module.exports=mongoose.model('Bookings',BookingSchema);
