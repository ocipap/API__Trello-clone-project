const router = require('express').Router()
const controller = require('./board.controller')
const auth = require('../../middlewares/auth')

/* 보드 전체 조회 */
router.get("/", auth, controller.getBoardList)

/* 보드의 리스트 조회 */
router.get('/:bid', auth, controller.getBoard)

/* 보드의 멕티비티 조회 */
router.get('/:bid/activity', auth, controller.getBoardActivity)

/* 보드의 멤버의 엑티비티 조회 */
router.get('/:bid/user/:uid/activity', auth, controller.getBoardActivityByUser)

/* 보드 추가 */
router.post("/", auth, controller.addBoard)

/* 보드 수정 */
router.put("/:bid", auth, controller.updateBoard)

/* 보드 삭제 */
router.delete("/:bid", auth, controller.deleteBoard)

/* 보드 맴버 리스트 가져 오기 */
router.get("/:bid/member", auth, controller.getMemeberList)

/* 보드 멤버 추가 */
router.post("/:bid/member", auth, controller.addMember)

/* 보드 멤버 권한 수정 */
router.put("/:bid/member/:mid", auth, controller.updateMember)

/* 보드 멤버 삭제 */
router.delete("/:bid/member/:mid", auth, controller.deleteMember)

module.exports = router