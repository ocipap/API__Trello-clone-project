const router = require('express').Router()
const controller = require('./list.controller')
const auth = require('../../middlewares/auth')

/* 리스트에 속해 있는 카드 조회 */
router.get("/:lid", auth, controller.getListList)

/* 리스트 추가 */
router.post('/', auth, controller.addList)

/* 리스트 타이틀 수정 */
router.put("/:lid", auth, controller.updateList)

/* 리스트 삭제 */
router.delete("/:lid", auth, controller.deleteList)

/* 리스트 이동 */
router.patch("/:lid", auth, controller.moveList)

module.exports = router