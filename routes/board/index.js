const router = require('express').Router()
const controller = require('./board.controller')

/* 보드 전체 조회 */
router.get("/", )

/* 보드 추가 */
router.post("/", )

/* 보드 수정 */
router.put("/:bid", )

/* 보드 삭제 */
router.delete("/:bid", )

/* 보드 배경 변경 */
router.patch("/:bid", )

/* 보드 맴버 리스트 가져 오기 */
router.get("/:bid/member", )

/* 보드 멤버 추가 */
router.post("/:bid/member", )

/* 보드 멤버 삭제 */
router.delete("/:bid/member/:mid", )

module.exports = router