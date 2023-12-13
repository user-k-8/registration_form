const express= require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const db = require('../db');
require('dotenv').config()// for .env file

const secret =process.env.secret;

const verifyJwt = (req, res, next)=>{

   const token = req.headers['access-token']
   if(!token){
    return res.json('Token is needed. Please log in')
   }
   else{
    jwt.verify(token,  secret, (err, decoded)=>{
      if(err){
        return res.json('Not Authenticated')
      }else{
        next();
      }
  })
 }
}

router.get('/profile-info', verifyJwt, (req, res)=>{

  return res.json('Authenticated')

})

router.post('/register', [
// Validate name
body('username').isAlpha().isLength({ min: 3 }),

// Validate email
body('email').isEmail(),

// Validate password
body('password').isLength({ min: 8 })
                .matches( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}$/),
],
 async (req, res)=>{

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors)
    return res.status(400).json({ errors: errors.array() });
 }

 const {username, email, password, rememberMe}= req.body
    
     //encrypt the password
     const hashedPwd = await bcrypt.hash(password, 10);
    
    //store the new user    
      const sql = `INSERT INTO users (username, email, password, rememberMe) SELECT  '${username}', '${email}', '${hashedPwd}', ${rememberMe} FROM dual WHERE NOT EXISTS (SELECT 1 FROM your_table_name WHERE email = '${email}' )`
        db.query(sql,  (err, result)=> {
          if (err) throw err;
          console.log(result);
          console.log('1 record inserted');
         
        });
    
     return res.status(200).json({status: 200}); 

})

router.post('/login',  async (req, res)=>{

    const {email, password}= req.body

    const sql = `SELECT email, password, user_id, username  FROM users WHERE email = '${email}'`;
    db.query(sql, (err, result)=> {
          if (err) throw err;
          console.log(result)        
         
          if(!result[0]){
            console.log('User not found');
            return res.status(404).send({status: '404'}); //User not found
          }

         // evaluate password 
         const match =  bcrypt.compareSync(password, result[0].password);
         if (match) {
            console.log('logged in')
                     
            const user_id = result[0].user_id
            const username = result[0].username
            //generate token
            const token = jwt.sign({user_id: user_id, username: username, email:email}, secret, {expiresIn: '300m'});
            return res.json({Login: true, token});    
        } 
        else {
          return  res.status(401).send({status: '401'});//unauthorised
        }
        });
})

router.post('/googlelogin',  async (req, res)=>{

  const {username,email, rememberMe}= req.body
     
     //check for email
      const sql = `SELECT email  FROM users WHERE email = '${email}'`;
        db.query(sql,  (err, result)=> {
        if (err) throw err;
        console.log(result)
       
        if(!result[0]){
            console.log('User not registered in db');
           //store the new user
           const sql = `INSERT INTO users (username, email,  rememberMe) VALUES ( '${username}', '${email}',  ${rememberMe})`;
           db.query(sql,  (err, result)=> {
              if (err) throw err;
              console.log('1 record inserted');
            });
        } 
            //generate token
            const token = jwt.sign({username: username, email: email}, secret, {expiresIn: '300m'});
            return res.json({Login: true, token});
      });
})

router.post('/forgot-password', async(req,res)=>{

  const {email} =req.body;
//check if user exists
  const sql = `SELECT email, password, user_id  FROM users WHERE email = '${email}'`;
  db.query(sql,  (err, result)=> {
  if (err) throw err;

  if(!result[0]){
      //user does not exist
      console.log('User not registered in db');
      return res.send({message: 'Account does not exist', status: 404});
  }
  else{
   // user exists
    const user_id = result[0].user_id
    const token = jwt.sign({email: result[0].email, user_id: user_id}, secret, {expiresIn: '20m'});
   
    const link = `https://registration-form-tv9c.onrender.com/api/reset-password/${user_id}/${token}`;
    console.log(link)
    //send email
    const transporter = nodemailer.createTransport({
     service: 'gmail',
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: process.env.userEmail,
       pass: process.env.userPassword,
     },
   });
   
   var mailOptions = {
     from:{
       name: 'Ruix',
       address: process.env.userEmail
     } ,
     to: `${email}`,
     subject: 'Password Reset',
     text: `Click the link below to reset your Ruix account password. This link expires in 20 minutes.
     ${link}`,
   };
   
   transporter.sendMail(mailOptions, (error, info)=>{
     if (error) {
       console.log(error);
     } else {
       console.log('Email sent: ' + info.response);
     }
   });
   return res.send({message: 'Email sent', status: 200});
  }

})
})

//get reset password form
router.get('/reset-password/:user_id/:token', async(req,res)=>{

  const {user_id, token} = req.params;

 try{
   const decodedToken = jwt.verify(token, secret);
   const email = decodedToken.email;

    //render reset form
    res.render('index', {email: email, status:'password not updated'})
   
}catch(error){
  res.send('Not verified')
  console.log(error)
}
})

//when user submits reset password form
router.post('/reset-password/:user_id/:token', async(req,res)=>{

  const {user_id, token} = req.params;
  const  {password} = req.body;

  try{
    const decodedToken = jwt.verify(token, secret);
    const email = decodedToken.email;
    //update password
    const hashedPwd = await bcrypt.hash(password, 10);
    const sql = `UPDATE users SET password = '${hashedPwd}' where email=${email}`;
    db.query(sql,  (err, result)=> {
      if (err) throw err;
      console.log('1 record updated');
    });
    //render page to direct users to login 
    res.render('index', {email: email, status:'password updated'})

  } catch(error){
    res.json({message: 'Something went wrong'});
    console.log(error)
  } 
});


module.exports= router
