const {User}=require('../models/User');

let auth = (req,res,next) =>{
  //인증처리과정

  //1.클라이언트에서 쿠키 토큰을 가져온다
  let token = req.cookie.x_auth;

  //2.토큰을 복호화 한 후 유저를 찾는다.
  User.findByToken()

  //3.유저가 있으면 인증 완료

  //4.유저가 없으면 인증 실패
}

module.exports = {auth};