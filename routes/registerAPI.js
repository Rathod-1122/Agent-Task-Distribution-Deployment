

const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const dotenv = require('dotenv')
const users = require('../models/UserRegisterSchema');

app.use(express.json());

router.post('/register', async (req, res) => {

  // console.log('inside the register API')
  let token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.jwtSecretKey)

  let user1 = new users({
    userEmailAndPasswordToken: token
  })

  users.insertMany([user1,])

  console.log('user created successfully')
  res.json({ status: 'success', message: 'user created successfully' })
})

module.exports = router;