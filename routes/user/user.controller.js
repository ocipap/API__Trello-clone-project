const jwt = require('jsonwebtoken')
const User = require('../../models').db.user
const salt = require('../../config/auth.config').salt
const nodemailer = require('nodemailer')
const mailConfig = require('../../config/mail.config')
const uuidv4 = require('uuid/v4')

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass
    }
})

/** 회원가입 */
exports.join = (req, res) => {
    const {
        username,
        password,
        email
    } = req.body

    const create = (user) => {
        if (user) {
            throw new Error('이미 존재하는 회원입니다.')
        } else {
            return User.create({
                username,
                password,
                email,
                photo: username.substr(0, 1)
            })
        }
    }

    const respond = () => {
        res.json({
            message: "회원 가입에 성공하였습니다.",
            result: true
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(409).json({
            message: error.message,
            result: false
        })
    }

    User.findOne({
            where: {
                username
            }
        })
        .then(create)
        .then(respond)
        .catch(onError)
}

/** 로그인 */
exports.login = (req, res) => {
    const {
        username,
        email,
        password
    } = req.body

    const check = (user) => {
        if (!user) {
            throw new Error('로그인에 실패하셨습니다.')
        } else {
            if (user.password === password) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign({
                            uid: user.uid,
                            username: user.username,
                            email: user.email
                        },
                        salt, {
                            expiresIn: '1d'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        })
                })
                return p
            } else {
                throw new Error("로그인에 실패하셨습니다.")
            }
        }
    }

    const respond = (token) => {
        res.json({
            message: "로그인에 성공하였습니다.",
            token,
            result: true
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json({
            message: error.message,
            result: false
        })
    }
    if (email !== undefined) {
        User.findOne({
                where: {
                    email
                }
            }).then(check)
            .then(respond)
            .catch(onError)
    } else {
        User.findOne({
                where: {
                    username
                }
            }).then(check)
            .then(respond)
            .catch(onError)
    }
}

/** 회원정보 가져오기 */
exports.getInfo = (req, res) => {
    const decoded = req.decoded;

    const check = (user) => {
        if (!user) {
            throw new Error("로그인이 필요합니다.")
        } else {
            return user
        }
    }

    const respond = (user) => {
        res.json({
            result: true,
            user
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json({
            message: error.message,
            result: false
        })
    }

    User.findOne({
            where: {
                uid: decoded.uid
            },
            attributes: ['uid', 'username', 'email', 'photo']
        }).then(check)
        .then(respond)
        .catch(onError)
}

/** 회원 정보 업데이트 */
exports.updateInfo = (req, res) => {
    const decoded = req.decoded
    const {
        username,
        email
    } = req.body

    const check = (user) => {
        if (user.username != username) {
            throw new Error("권한이 없습니다.");
        } else {
            return User.update({
                email
            }, {
                where: {
                    uid: user.uid
                }
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "회원 정보 수정에 성공하셨습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(403).json({
            result: false,
            message: error.message
        })
    }

    User.findOne({
            where: {
                uid: decoded.uid
            }
        }).then(check)
        .then(respond)
        .catch(onError)
}

/** reset code 발급 */
exports.issueResetCode = (req, res) => {
    const {
        email
    } = req.body

    const generateCode = (user) => {
        if (!user) {
            throw new Error("일치하는 계정이 없습니다.")
        } else {
            let date = new Date()
            let reset_code = uuidv4()
            date.setDate(date.getDate() + 1)
            return User.update({
                reset_code,
                reset_code_expiredate: date
            }, {
                where: {
                    uid: user.uid
                }
            })
        }
    }

    const sendMail = () => {
        User.findOne({
            attributes: ["reset_code", "username", "email"],
            where: {
                email
            }
        }).then((user) => {
            let {
                uid,
                username,
                reset_code
            } = user
            let reset_url = `http://localhost:3001/reset?uid=${uid}&resetCode=${reset_code}`
            let dont_reset_url = `http://localhost:3001/reset?uid=${uid}&resetCode=${reset_code}&reset=false`
            let mailOption = {
                from: mailConfig.user,
                to: email,
                subject: 'Trello Password Reset',
                html: `<div style="font: 15px 'Helvetica Neue',Arial,Helvetica;background-color: #F0F0F0; height: 420px; display: flex; align-items: center; justify-content: center; color: #333">
            <div style="background-color: #fff; width: 464px; height: 320px;border-radius: 4px;display: flex; flex-direction: column">
                <div style="height: 60px;background-color: #0079bf; display: flex; align-items: center; justify-content: center; border-top-left-radius: 4px;border-top-right-radius: 4px;"><img width="120px" src="https://trello.com/images/email-header-logo-white-v2.png" alt=""></div>
                <div style="flex: 1 1 auto; padding: 10px 20px;display: flex; flex-direction: column; justify-content: space-around">
                    <div style="font-weight: bold;font-size: 20px;">Hello ${username},</div>
                    <div>We heard you need a password reset. Click the link below and you'll be redirected to a secure site from which you can set a new password.</div>
                    <div style="display: flex; align-items: center; justify-content: center"><a href="${reset_url}" style="background-color: #3aa54c; border-radius: 3px; text-decoration: none; color: #fff; font-size: 16px; font-weight: 700; padding: 10px 50px;">Reset Password</a></div>
                    <div style="color: #939393">If you didn't try to reset your password, <a href="${dont_reset_url}" style="color: #365FC9">click here</a> and we'll forget this ever happened.</div>
                </div>
            </div>
            </div>`
            }
            smtpTransport.sendMail(mailOption, function (err, info) {
                if (err) {
                    console.error('Send Mail error : ', error)
                    throw new Error('메일 전송에 실패했습니다.')
                } else {
                    return;
                }
            })
        }).catch((error) => {
            throw new Error("프로세스 오류 발생")
        })
    }

    const respond = () => {
        res.json({
            result: true,
            message: "성공적으로 코드를 발급했습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json({
            result: false,
            message: error.message
        })
    }

    User.findOne({
            where: {
                email
            },
            attributes: ['uid', 'username', 'email']
        }).then(generateCode)
        .then(sendMail)
        .then(respond)
        .catch(onError)

}

/** 비밀번호 변경 */
exports.updatePassword = (req, res) => {
    const {
        password
    } = req.body
    const {
        uid,
        resetCode
    } = req.query

    const verify = (user) => {
        if (user.reset_code == resetCode &&
            new Date(user.reset_code_expiredate) > Date.now()) return true
        else return false
    }

    const check = (user) => {
        if (!user) {
            throw new Error("존재하지 않는 사용자입니다.")
        } else {
            if (verify(user)) {
                return User.update({
                    password,
                    reset_code: null,
                    reset_code_expiredate: null
                }, {
                    where: {
                        username: user.username
                    }
                })
            } else {
                throw new Error("유효하지 않은 코드입니다.")
            }
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "패스워드를 성공적으로 변경하였습니다. 변경한 패스워드로 로그인해주세요."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(403).json({
            result: false,
            message: error.message
        })
    }

    User.findOne({
            where: {
                uid
            },
            attributes: ["uid","username", "reset_code", "reset_code_expiredate"]
        }).then(check)
        .then(respond)
        .catch(onError)
}