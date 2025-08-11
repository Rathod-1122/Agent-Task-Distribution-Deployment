

const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const multer = require('multer')
const router = express.Router();
const dotenv = require('dotenv')
dotenv.config();
const users = require('../models/UserRegisterSchema');

const app = express();
app.use(express.json());

const upload = multer({des:'upload'})

router.post('/register',upload.none(), async (req, res) => {

  console.log('inside the register API')
  // let token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.jwtSecretKey)
  let hashedPassword = await bcrypt.hash(req.body.password,10)

  let user1 = new users({
    email: req.body.email,
    password:hashedPassword
  })

  users.insertMany([user1,])
  console.log('user in server side is:',user1)

  console.log('user created successfully')
  res.json({ status: 'success', message: 'user created successfully' })
})

module.exports = router;