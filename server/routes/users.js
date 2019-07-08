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
          maxAge: 10000 * 60 * 2
        })
        res.cookie('userName', userDoc.userName, {
          path: "/",
          maxAge: 10000 * 60 * 2
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

router.get("/cart", (req, res, next) => {
  let id = req.cookies.userId
  User.findOne({userId: id}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          result: {
            data: doc
          }
        })
      } else {
        res.json({
          status: 1,
          msg: '服务器错误'
        })
      }
    }
  })
})
router.get("/order", (req, res, next) => {
  let id = req.cookies.userId
  User.findOne({userId: id}, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          result: {
            data: doc
          }
        })
      } else {
        res.json({
          status: 1,
          msg: '服务器错误'
        })
      }
    }
  })
})

router.post("/editcart", (req, res, next) => {
  let userId = req.cookies.userId
  let {productId, productNum, checked} = req.body.params

  User.updateOne(
    {"userId": userId, "cartList.productId": productId},
    {"cartList.$.productNum": productNum, "cartList.$.checked": checked},
    (err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message
        })
      } else {
        res.json({
          status: 0,
          msg: "succ"
        })
      }
    })
})

router.post("/deleteitem", (req, res, next) => {
  let userId = req.cookies.userId
  let {productId} = req.body.params

  User.updateOne({
    userId: userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: "succ"
      })
    }
  })
})

router.post("/setdefault", async (req, res, next) => {
  let userId = req.cookies.userId
  let {preAddId, newAddId} = req.body.params
  let result1 = await updateDefaultAddress(userId, preAddId, false)
  let result2 = await updateDefaultAddress(userId, newAddId, true)
  if (!result1.status && !result2.status) {
    res.json({
      status: 0,
      msg: "succ"
    })
  }

    })

function updateDefaultAddress(userId, id, bool) {
  bool = bool || false
  return new Promise((resolve, reject) => {
    User.updateOne(
      {"userId": userId, "addressList.addressId": id},
      {"addressList.$.isDefault": bool},
      (err, doc) => {
        if (err) {
          reject({
            status: 1,
            msg: err.message
          })
        } else {
          resolve({
            status: 0,
            msg: "succ"
          })
        }
      })
  })
}


module.exports = router;
