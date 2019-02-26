const router = require('express').Router()
const controller = require('./comment.controller')

/* 댓글 추가 */
router.post("/", controller.addComment)

/* 댓글 수정 */
router.put("/:commnet_id", controller.updateComment)

/* 댓글 삭제 */
router.delete("/:comment_id", controller.deleteComment)

module.exports = router;





