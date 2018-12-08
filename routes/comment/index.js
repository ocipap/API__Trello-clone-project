const router = require('express').Router()
const controller = require('./comment.controller')

/* 댓글 조회 */
router.get("/")

/* 댓글 추가 */
router.post("/")

/* 댓글 수정 */
router.put("/:commnet_id")

/* 댓글 삭제 */
router.delete("/:comment_id")





