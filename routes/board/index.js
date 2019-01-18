const router = require('express').Router()
const controller = require('./board.controller')

/* 보드 전체 조회 */
router.get("/", controller.getBoardList)

/* 보드 추가 */
router.post("/", controller.addBoard)

/* 보드 수정 */
router.put("/:bid", controller.updateBoard)

/* 보드 삭제 */
router.delete("/:bid", controller.deleteBoard)

/* 보드 맴버 리스트 가져 오기 */
router.get("/:bid/member", controller.getMemeberList)

/* 보드 멤버 추가 */
router.post("/:bid/member", controller.addMember)

// /* 보드 멤버 삭제 */
// router.delete("/:bid/member/:mid", controller.deleteMember)

module.exports = router