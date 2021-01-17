const mongoose = require('mongoose');

const userShcema = mongoose.Schema({
    name : {
        type : String,
        maxlength: 50
    },
    email : {
        type : String,
        trim : true, //trim은 빈칸을 없애주는 역할 (db에 값이 들어갔들때 띄어쓰기 없애주는듯)
        unique : 1 // 똑같은 이메일 쓰지 못하게 막아줌?
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength: 50
    },
    role :{
        type : Number,
        default : 0 //관리자는 1 , 일반사용자는 0
    },
    image : String, 
    token : { //유효성 검사 하기 위해 
        type : String
    } ,
    tokenExp : { // 토큰 유효기간
        type : Number
    }
})

const User = mongoose.model('User',userShcema); // 스키마를 모델로 만든다. 이름은 User이며 userShcema 를 담는다.

module.exports = {User} // 다른곳에서도 User를 쓸수 있게 해주는 export default 같은 개념인듯?