const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const { auth } = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: true })); //url 형식으로 가져올수 있는듯 ? get방식인가??...
app.use(bodyParser.json()); //json 타입으로 분석해서 가져올수 있다.
// mongodb+srv://Obok:<password>@boiler.1cy5i.mongodb.net/<dbname>?retryWrites=true&w=majority
app.use(cookieParser());

mongoose
  .connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // 위에 4가지 쓰는 이유는 안쓰면 에러 뜬다 ㅡ,,ㅡ
  })
  .then(() => console.log("MongoDB Success!!!"))
  .catch((err) => console.log("MongoDB No!!!"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users/register", (req, res) => {
  // 회원가입할때 필요한 정보들을 클라이언트에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.status(200).json({ success: true });
    }
  }); //save 는 몽고db 메소드?
});

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 DB안에 있는지 찾는다.
  // 요청된 이메일이 이메일이 있다면 맞는 비밀번호인지 확인
  // 비밀번호까지 맞다면 토큰을 생성하기

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "없어 짜식아 ㅋ",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비번 틀림 ㅋ" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
        //토큰을 저장한다. 나는 쿠키에 한다.
        console.log("AA");
      });
    });
  });
});

// admin 0 , 특정부서 2 , 일반유저 0

app.get("/api/users/auth", auth, (req, res) => {
  //미들웨어란 콜백펑션 하기 전에 중단해서 먼가를 가공 해주는거 같음
  res.status(200).json({
    _id: req.user._id,
    isAdmon: req.user.role === 0 ? true : false,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
