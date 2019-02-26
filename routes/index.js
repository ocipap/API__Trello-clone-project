const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const user = require('./user')
const board = require('./board')
const list = require('./list')
const card = require('./card')
const comment = require('./comment')
const activity = require('./activity')

router.use("/user", user)
router.use("/board", auth, board)
router.use("/list", auth, list)
router.use("/card", auth, card)
router.use("/comment", auth, comment)
// router.use("/activity", auth, activity)

module.exports = router