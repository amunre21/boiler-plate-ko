const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');
const config = require('./config/key');

//바디파서를  app/x-www-form-urlencoded 형식을 가져오고
//아래는 json 타입을 가져올수 있게 하기 위함이다.
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//몽구스DB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI ,{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('mongoDB Connected...'))
.catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World! 실험중')
})

//회원가입 포스트
app.post('/api/users/register',(req, res) => {
  //회원가입 정보 입력
    const user = new User(req.body)

    //여기서 save는 몽고의 메소드다
    user.save((err,doc) => {
      if(err) return res.json({success: false, err})
      return res.status(200).json({
        success: true
      })
    })
})

//로그인 라우터
app.post('/api/users/login', (req,res) => {
  User.findOne({email:req.body.email},(err,user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "일치하는 이메일이 없습니다."
      })
    }
    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch) return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다."
      })
      //비밀번호 일치 시 토큰생성
      user.generateToken((err,user) =>{
        if(err) return res.status(400).send(err);
        //토큰 저장 -> 쿠키, 로컬스토리지
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess:true,userId:user._id})

      })
    })
  })
})


app.get('/api/users/auth',auth,(req,res)=>{
  //여기까지 들어오면 auth를 통과해서 왔다는 뜻.
  //이제 auth를 통과했으니 클라이언트에게 전달해줄 차례
  res.status(200).json({
    _id:req.user._id,
    isAdmin:req.user.role === 0 ? false : true,
    isAuth: true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image
  })
})

app.get('/api/users/logout',auth,(req,res)=>{
  //로그인 상태이기때문에 auth를 거치는것이 맞다.

  //미들웨어에서 auth로 인증된 req.user의 _id로 찾는다
  //만약 찾았으면 업데이트를 해주는데, 내용은 token 내용을 비우고 결과에 다라 false혹은 200상태를 반환한다.
  User.findOneAndUpdate({_id:req.user._id},
    {token:""},
    (err,user)=>{
      if(err) return res.json({success:false, err});
      return res.status(200).send({
        success:true
        ,userId:user._id
      })
    })  
})


app.listen(port, () => {  
  console.log(`Example app listening at http://localhost:${port}`)
})