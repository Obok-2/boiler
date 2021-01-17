const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose');
// mongodb+srv://Obok:<password>@boiler.1cy5i.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect("mongodb+srv://Obok:express1234@boiler.1cy5i.mongodb.net/boiler?retryWrites=true&w=majority",{
    useNewUrlParser : true , useUnifiedTopology : true , useCreateIndex : true , useFindAndModify : false 
    // 위에 4가지 쓰는 이유는 안쓰면 에러 뜬다 ㅡ,,ㅡ
}).then(()=>console.log("fawfaw")).catch(err=>console.log("zzzzzzz"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


