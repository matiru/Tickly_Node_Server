const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./routers/user-routes')


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Acess-Control-Aloow-Methods', 'GET,POST,PUT,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/',(req,res)=>{
    res.json({message:'crm backend'})
})

app.use('/users', userRouter);

const port = process.env.PORT|| 6060;
app.listen(port,()=>{console.log(`Server running on port ${port}`)})