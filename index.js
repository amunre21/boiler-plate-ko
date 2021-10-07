const express = require('express')
const app = express()
const port = 5000
const dbid = 'amunre'
const dbpassword = '5618'

//몽구스DB 연결
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${dbid}:${dbpassword}@boilerplate.p1qth.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('mongoDB Connected...'))
.catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {  
  console.log(`Example app listening at http://localhost:${port}`)
})