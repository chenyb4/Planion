const {StatusCodes} =require('http-status-codes');

const isAdmin=(req,res,next)=>{
    if(req.user.role.includes('admin')){
        return next();
    }

    res.status(StatusCodes.UNAUTHORIZED).send('You need to be admin for this!');
};



module.exports=isAdmin;