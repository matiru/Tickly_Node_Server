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
                }},
        getCompanies: async (req, res) => {
                    try {
                        await pool.connect()
                        let data = await pool.request().execute(`GetCompanies`)
                        res.json(data.recordset)
                    } catch (error) {
                        console.log(error)
                    }},
        addCompany : async(req,res)=>{
            const { id, name, location, owner, contact_person_email } = req.body;
            try {
                await pool.connect();
                await pool.request()
                    .input('id', sql.Char(4), id)
                    .input('name', sql.VarChar(255), name)
                    .input('location', sql.VarChar(255), location)
                    .input('owner', sql.VarChar(255), owner)
                    .input('contact_person_email', sql.VarChar(255), contact_person_email)
                    .query(`
                        INSERT INTO COMPANIES (id, name, location, owner, contact_person_email)
                        VALUES (@id, @name, @location, @owner, @contact_person_email)
                    `);
                res.json({ message: 'Company added successfully' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },

        addUser : async (req, res) => {
            const { id, email, role, password, phone_number, name, company_id } = req.body;
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
        
                await pool.connect();
                await pool.request()
                    .input('id', sql.Char(4), id)
                    .input('email', sql.VarChar(255), email)
                    .input('role', sql.VarChar(20), role)
                    .input('is_Active', sql.Bit, 1) // Assuming new user is active by default
                    .input('password', sql.VarChar(255), hashedPassword)
                    .input('phone_number', sql.VarChar(20), phone_number)
                    .input('name', sql.VarChar(255), name)
                    .input('created_at', sql.DateTime, new Date())
                    .input('rating', sql.Int, 0) // Assuming initial rating is 0
                    .input('company_id', sql.Char(4), company_id)
                    .query(`
                        INSERT INTO USERS (id, email, role, is_Active, password, phone_number, name, created_at, rating, company_id)
                        VALUES (@id,  @email,@role, @is_Active, @password, @phone_number, @name, @created_at, @rating, @company_id)
                    `);
                res.json({ message: 'User added successfully' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    
        


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