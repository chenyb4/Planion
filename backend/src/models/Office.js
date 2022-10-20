const mongoose=require('mongoose');

const OfficeSchema=mongoose.Schema({
    maxNrOfPeopleAllowed:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('Offices',OfficeSchema);
