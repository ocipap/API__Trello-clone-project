const router = require('express').Router()
const auth = require('../../middlewares/auth')
const controller = require('./user.controller')

/* 회원가입 */
router.post('/join', controller.join)

/* 로그인 */
router.post('/login', controller.login)

/* 회원 정보 가져오기*/
router.get('/info', auth, controller.getInfo)

/* 회원 정보 업데이트 */
router.put('/info', auth, controller.updateInfo)

/* reset code 검증 */
router.get('/reset', controller.verifyResetCode)

/* reset code 발급 */
router.post('/reset', controller.issueResetCode)

/* reset code 삭제 */
router.delete('/reset', controller.deleteResetCode)

/* 비밀번호 변경 */
router.put('/reset', controller.updatePassword)

/* 이메일로 유저 리스트 검색 */
router.get('/email/:email', auth, controller.getUserList)

module.exports = router