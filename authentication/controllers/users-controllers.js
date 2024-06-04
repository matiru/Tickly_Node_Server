const sql = require('mssql');
const{config} = require('../sql-config');
const bcrypt = require('bcrypt');
const pool = new sql.ConnectionPool(config);
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


const createToken =(payload)=>{
    const secret = jwtSecret;
    const options ={expiresIn :'1m'};
    return jwt.sign(payload,secret,options)
}

module.exports ={
    getAllUsers : async (req,res) =>{
        try{
            await pool.connect()
            let data = await pool.request().execute(`GetUsers`)
            res.json(data.recordset)
        }
        catch(error){
            console.log(error)
        }
    },

    Login: async(req,res)=>{
        const{email,password} = req.body;
        try{
            await pool.connect();
            let data =await pool.request()
            .input('email',email)
            .execute(`get_single_users`);
            
            if (data.recordset.length){
                let user = data.recordset[0];
                let dbPass = user.password;
                let result = await bcrypt.compare(password,dbPass);
                if (result){
                    let token = createToken({email});
                    res.json({response : "Login successful", user ,token})
                }
                else {
                    res.json({ response: "Check your credentials" });
                }
            } else {
                res.status(400).json({ message: 'User not found!' });
            }
        } catch (error) {
            res.status(500).json(error.message);

            }
        },

        getAllClients: async (req, res) => {
            try {
                await pool.connect()
                let data = await pool.request().execute(`GetCustomers`)
                res.json(data.recordset)
            } catch (error) {
                console.log(error)
            }},

          
        getAllAgents: async (req, res) => {
                try {
                    await pool.connect()
                    let data = await pool.request().execute(`GetAgents`)
                    res.json(data.recordset)
                } catch (error) {
                    console.log(error)
                }}

        
    
        


    }

    
    


// changing the intial data to be hashed
// const updatePasswords = async () => {
//     try {
//         await pool.connect();
//         let data = await pool.request().query('SELECT id, email, password FROM USERS');
//         for (let user of data.recordset) {
//             let hashedPassword = await bcrypt.hash(user.password, 10);
//             await pool.request()
//                 .input('id', user.id)
//                 .input('password', hashedPassword)
//                 .query('UPDATE USERS SET password = @password WHERE id = @id');
//         }
//         console.log('Passwords updated successfully');
//     } catch (error) {
//         console.error('Error updating passwords:', error);
//     }
// };

// updatePasswords();