const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  //이름, 이메일, 비밀번호, 마지막 이름, 역할(기본값 0), 이미지, 토큰, 토큰유효기간
  name:{
    type: String,
    maxlenght: 20
  },
  email:{
    type: String,
    trim: true,
    unique:1
  },
  password:{
    type: String,
    minlenght:5
  },
  lastname:{
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

const User = mongoose.model('User', userSchema);

module.exports = {User};