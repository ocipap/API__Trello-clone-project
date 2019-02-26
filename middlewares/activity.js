const models = require("../models")
const Activity = models.db.activity

const addActivity = (data) => {
    let t
    const {type, bid, uid, cid, message} = data
    models.sequelize.transaction(transaction => {
        t = transaction
        return Activity.create({
            type,
            bid,
            cid,
            uid,
            message
        },{
            transaction: t
        })
    }).then(() => {
        console.log(":::: 엑티비티 추가 성공 ::::")
    })
    .catch((error) => {
        console.error(error.message)
        console.log.apply(":::: 엑티비티 추가 실패 ::::")
    })
}

module.exports = addActivity