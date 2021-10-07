const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const { User } = require('./models/User');

//바디파서를  app/x-www-form-urlencoded 형식을 가져오고
//아래는 json 타입을 가져올수 있게 하기 위함이다.
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//몽구스DB 연결
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://amunre:5618@boilerplate.p1qth.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('mongoDB Connected...'))
.catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World! 실험중')
})

app.post('/register',(req, res) => {
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

app.listen(port, () => {  
  console.log(`Example app listening at http://localhost:${port}`)
})