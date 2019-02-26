const models = require('../../models')
const User = models.db.user
const Board = models.db.board
const List = models.db.list
const Member = models.db.member
const Activity = models.db.activity
const ErrorHandler = require('../../middlewares/error').ErrorHandler

const addActivity = (req, res) => {
    let t
    const {bid, type, cid, message} = req.body
}

module.exports = {
    addActivity
}