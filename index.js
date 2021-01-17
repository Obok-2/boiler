const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose');

const { User } = require('./models/User');
const config = require('./config/key');
app.use(bodyParser.urlencoded({extended: true})); //url 형식으로 가져올수 있는듯 ? get방식인가??...
app.use(bodyParser.json()) //json 타입으로 분석해서 가져올수 있다.
// mongodb+srv://Obok:<password>@boiler.1cy5i.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect(config.dbUrl,{
    useNewUrlParser : true , useUnifiedTopology : true , useCreateIndex : true , useFindAndModify : false 
    // 위에 4가지 쓰는 이유는 안쓰면 에러 뜬다 ㅡ,,ㅡ
}).then(()=>console.log("MongoDB Success!!!")).catch(err=>console.log("MongoDB No!!!"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register',(req,res)=>{
  // 회원가입할때 필요한 정보들을 클라이언트에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  user.save((err,userInfo)=>{
    if(err) {
      return res.json({success : false,err})
    }else {
      return res.status(200).json({success:true})
    }
  }) //save 는 몽고db 메소드?

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


