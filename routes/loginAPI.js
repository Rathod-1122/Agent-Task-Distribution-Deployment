

const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const dotenv = require('dotenv')
const users = require('../models/UserRegisterSchema');
app.use(express.json());


router.get('/login/:email/:password', async (req, res) => {

  // console.log('inside the login API')
  let result = await users.find();

  if (result.length > 0) {
    for (i = 0; i < result.length; i++) {
      decrypt = jwt.verify(result[i].userEmailAndPasswordToken, process.env.jwtSecretKey);
      // console.log(decrypt)
      if (decrypt.email == req.params.email) {
        if (decrypt.password == req.params.password) {
          return res.json({ status: 'success', message: 'user loged in successfully' })
        }
        else {
          return res.json({ status: 'failed', message: 'enter the valid password' })
        }
      }
    }
    return res.json({ status: 'failed', message: 'enter the valid email' })
  }
  else {
    return res.json({ message: 'There are no any users in the database,please register first' })
  }

})

module.exports = router;