const { User } = require("../models/User");
  
    let auth = (req,res,next) =>{
        // 인증 처리를 하는 곳

        // 클라이언트 토큰에서 쿠키를 가져온다.

        // 토큰을 복호화 한 후 유저를 찾는다.

        // 유저가 있으면 인증 OK / 없으면 NO 
        let token = req.cookies.x_auth;
        console.log(token);
        User.findByToken(token,(err,user)=>{
            
            if(err) throw err; 
            if(!user) return res.json({isAuth:false,error : true})
        
            req.token = token;
            req.user = user;
            next();
            
        })
    }

    module.exports = {auth};