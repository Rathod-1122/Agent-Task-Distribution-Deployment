

const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router();
const dotenv = require('dotenv')
dotenv.config();
const users = require('../models/UserRegisterSchema');

// app.use(express.json());
router.get('/login/:email/:password', async (req, res) => {
  console.log('inside the login api')

  let result = await users.find().and({email:req.params.email});

  if (result.length > 0) {
    console.log('email is valid')
    for (i = 0; i < result.length; i++) {

      let isPasswordCorrect = await bcrypt.compare(req.params.password,result[i].password)
      console.log('the isPasswordCorrect value is :',isPasswordCorrect)
      if(isPasswordCorrect)
        {
          let token=jwt.sign({email:result[i].email,password:result[i].password},'key');
          console.log('password is matched')
          return res.json({status:'success',message:'user login successfull',data:{email:result[i].email},encryptedData:token})
        }
        if(i===result.length-1){
          console.log('enter the correct password')
          return res.json({status: 'failed',message:'enter the correct password'})
        }
    }
   
  }
  else {
    return res.json({ status: 'failed', message: 'enter the correct email' })
  }

})

module.exports = router;