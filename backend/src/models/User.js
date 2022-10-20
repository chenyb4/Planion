const mongoose=require('mongoose');


const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    role:{
        type:Array,
        required: true
    },
    department:{
        type:String,
        required: false,
        default: null
    },
    phone:{
        type:String,
        required: false,
        default: null
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    secret:{
        type:String,
        required:true
    }

});

module.exports=mongoose.model('Users',UserSchema);
