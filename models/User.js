const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
//const secretToken = 56185618;

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

userSchema.pre('save', function(next){
  let user = this;
  //db 전송 전 비밀번호 암호화 작업
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err); //에러 발생시 next로 err메시지 보냄
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
          // Store hash in your password DB.
      });
    });  
  }else{
    next();
  }  
})

userSchema.methods.comparePassword = function(plainPassword, cb){
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err);
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function(cb){
  let user = this;
  //token 생성기
  let token = jwt.sign(user._id.toHexString(), '56185618')
  user.token = token;
  user.save(function(err,user){
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb){
  let user = this;
  //가져온 토큰을 복호화
  jwt.verify(token, '56185618', function(err, decoded){
    //유저 아이디와 대조
    user.findOne({"_id":decoded, "token":token}, function(err,user){
      if(err) return cb(err);
      cb(null, user);
    })
  })

}

const User = mongoose.model('User', userSchema);

module.exports = { User };