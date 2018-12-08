const router = require('express').Router()
const controller = require('./list.controller')

/* 리스트 조회 */
router.get("/")

/* 리스트 추가 */
router.post("/")

/* 리스트 삭제 */
router.delete("/:lid")

/* 리스트 타이틀 수정 */
router.put("/:lld")

/* 리스트 이동 */
router.patch("/:lid")

module.exports = router