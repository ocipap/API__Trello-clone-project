const router = require('express').Router()
const controller = require('./card.controller')

/* 카드 조회 */
router.get("/")

/* 카드 상세 조회 */
router.get("/:cid")

/* 카드 추가 */
router.post("/")

/* 카드 삭제 */
router.delete("/:cid")

/* 카드 수정 */
router.put("/:cid")

/* 카드 이동 */
router.patch("/:cid")

module.exports = router;


