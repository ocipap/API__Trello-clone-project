const router = require("express").Router()
const controller = require("./activity.controller")

/* 이벤트 로그 저장 */
router.post("/", controller.addActivity)

module.exports = router
