const express=require('express');
const app=express();
const port=3000;
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
//requiring env hidden db connection string
require('dotenv/config');

const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());


app.use('/users',require('./routes/user'));
app.use('/bookings',require('./routes/booking'));
app.use('/offices',require('./routes/office'));
app.use('/credentials',require('./routes/credentials'));


//connect to DB
mongoose.connect(process.env.DB_CONNECTION,()=>{
    console.log('Connected to DB!');
})


app.listen(port,()=>{
    console.log(`Planion API is running on port ${port}`);
});