const userRouter  = require('express').Router();



const {getAllUsers,Login, getAllAgents,getAllClients} = require('../controllers/users-controllers');

userRouter.get('/allusers',getAllUsers);
userRouter.get('/agents',getAllAgents);
userRouter.get('/clients',getAllClients);




userRouter.post('/login',Login);


module.exports =userRouter;