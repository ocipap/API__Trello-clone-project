const router = require('express').Router()
const auth = require('../../middlewares/auth')
const controller = require('./user.controller')

/* 회원가입 */
router.post('/join')

/* 로그인 */
router.post('/login')

/* 회원정보 */
router.get('/info', auth)

/* 회원정보 수정 */
router.put('/info', auth)

/* reset 코드 값 체크 */
router.get('/reset/:username/:resetCode')

/* 회원 비밀번호 수정 */
router.patch('/reset/:username/:resetCode')

/* 회원 아메일로 검색 */
router.patch('/email/:email')

module.exports = router