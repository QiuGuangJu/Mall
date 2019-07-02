var express = require('express');
var router = express.Router();
const User = require("../models/user")

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  const param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  User.findOne(param, (err, userDoc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (userDoc) {
        res.cookie('userId', userDoc.userId, {
          path: "/",
          maxAge: 1000 * 60 * 2
        })
        res.cookie('userName', userDoc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 2
        })
        req.session['userId'] = userDoc.userId
        res.json({
          "status": 0,
          "msg": '',
          "result": {
            "userName": userDoc.userName
          }
        })
      } else {
        res.json({
          status: 1,
          msg: '用户名或密码错误'
        })
      }
    }
  })
})

router.post("/logout", (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: 0,
    msg: ''
  })
})

router.get("/loginCheck", (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: {
        userName: req.cookies.userName || ''
      }
    })
  }
})

module.exports = router;
