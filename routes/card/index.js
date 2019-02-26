const router = require('express').Router()
const controller = require('./card.controller')

/* 카드 상세 조회 */
router.get("/:cid", controller.getCardDetail)

/* 카드 엑티비티 조회 */
router.get("/:cid/activity", controller.getActivityByCard)

/* 카드 댓글 조회 */
router.get("/:cid/comment", controller.getCommentByCard)

/* 카드 추가 */
router.post('/', controller.addCard)

/* 카드 삭제 */
router.delete("/:cid", controller.deleteCard)

/* 카드 수정 */
router.put("/:cid", controller.updateCard)

/* 카드 이동 */
router.patch("/:cid", controller.moveCard)

module.exports = router;


