const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const jwt = require('jsonwebtoken')
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

userShcema.pre('save',function(next){
    //유저 데이터를 index.js 에서 저장하기 전에!!!
    // function 을 활용해 가공한다.
    let user = this;
   
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)
                return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                // Store hash in your password DB.
                next() //next는 함수를 다 실행 후 index.js 의 registe부분을 실행한다.
            });
        });
    }else {
        next()
    }
}); 

userShcema.methods.comparePassword = function(plainPassword,cb){
    // plainPassword 1234567 과 암호화된 비밀번호 비교

    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        
        if(err) return cb(err);
        
        cb(null,isMatch)
        
    })
}

userShcema.methods.generateToken = function(cb){
    //jsonwebtoken을 사용하여 토큰 생성하기
    let user = this;
    let token = jwt.sign(user._id.toHexString(),'secretToken')
    // let token = user._id + 'secretToken';
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

userShcema.statics.findByToken = function(token,cb) {
    let user = this;
    
    // 토큰을 decode 한다.
    jwt.verify(token,'secretToken',function(err,decode){
        // 유저 아이디를 이용해서 유저를 찾은 다음
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        
        user.findOne({"_id" : decode , "token" : token}, function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

const User = mongoose.model('User',userShcema); // 스키마를 모델로 만든다. 이름은 User이며 userShcema 를 담는다.

module.exports = {User} // 다른곳에서도 User를 쓸수 있게 해주는 export default 같은 개념인듯?