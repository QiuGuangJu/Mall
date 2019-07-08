const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Goods = require('../models/goods')

mongoose.connect('mongodb://127.0.0.1:27017/Mall',{useNewUrlParser: true})

mongoose.connection.on('connected', () => {
  console.log("MongoDB connected success")
})

mongoose.connection.on('error', () => {
  console.log("MongoDB connected fail")
})

mongoose.connection.on('disconnected', () => {
  console.log("MongoDB disconnected")
})

// 查询商品列表
router.get("/", (req, res, next) => {
  let page = parseInt(req.param("page"))
  let pageSize = parseInt(req.param("pageSize"))
  let sort = req.param("sort")
  let skip = (page - 1) * pageSize
  let priceLevel = req.param("priceLevel")
  let params = {}

  if (priceLevel !== 'all') {
    let priceGt = ''
    let priceLt = ''
    switch (parseInt(priceLevel)) {
      case 0:
        priceGt = 100;
        priceLt = 500;
        break
      case 1:
        priceGt = 500;
        priceLt = 1000;
        break
      case 2:
        priceGt = 1000;
        priceLt = 2000;
        break
      case 3:
        priceGt = 2000;
        priceLt = 5000;
        break
      case 4:
        priceGt = 5000;
        priceLt = 10000;
        break
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lt: priceLt
      }
    }
  } else {
    params = {}
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

// 添加购物车
router.post("/addCart", (req, res, next) => {
  const userId = '100000077',
    productId = req.body.productId,
    User = require("../models/user")
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        "status": 1,
        "msg": err.message
      })
    } else {
      if (userDoc) {
        let item = ''
        userDoc.cartList.forEach(val => {
          if (val.productId === productId) {
            item = val
          }
        })
        Goods.findOne({productId: productId}, (err2, doc) => {
          if (err2) {
            res.json({
              "status": 1,
              "msg": err2.message
            })
          } else {
            if (doc) {
              if (item) {
                item.productNum++
              } else {
                item = doc
                item.productNum = 1
                item.checked = 1
                userDoc.cartList.push(item)
              }
              userDoc.save((err3, doc2) => {
                if (err3) {
                  res.json({
                    status: 1,
                    msg: err2.message
                  })
                } else {
                  res.json({
                    status: 0,
                    msg: '',
                    result: 'succ'
                  })
                }
              })
            }
          }
        })

      }
    }
  })
})

module.exports = router
