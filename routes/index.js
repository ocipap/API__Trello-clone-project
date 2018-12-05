const express = require('express')
const router = express.Router();

const user = require('./user')
const board = require('./board')
const list = require('./list')
const card = require('./card')
const comment = require('./comment')
const activity = require('./activity')

router.use("/user", user)
router.use("/board", board)
router.use("/list", list)
router.use("/card", card)
router.use("/comment", comment)
router.use("/activity", activity)

module.exports = router