const userRouter  = require('express').Router();



const {getAllUsers,Login, getAllAgents,getAllClients,addCompany,addUser,getCompanies} = require('../controllers/users-controllers');

userRouter.get('/allusers',getAllUsers);
userRouter.get('/agents',getAllAgents);
userRouter.get('/clients',getAllClients);
userRouter.get('/companies',getCompanies);






userRouter.post('/login',Login);
userRouter.post('/addCompany',addCompany);
userRouter.post('/addUser',addUser)


module.exports =userRouter;