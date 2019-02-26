const jwt = require('jsonwebtoken')
const models = require('../../models')
const User = models.db.user
const salt = require('../../config/auth.config').salt
const nodemailer = require('nodemailer')
const mailConfig = require('../../config/mail.config')
const uuidv4 = require('uuid/v4')
const Op = models.sequelize.Op
const ErrorHandler = require('../../middlewares/error').ErrorHandler

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass
    }
})

/** 회원가입 */
const join = (req, res) => {
    let t
    const {
        username,
        password,
        email
    } = req.body

    const create = (user) => {
        if (user) {
            throw new Error('EXIST')
        } else {
            return User.create({
                username,
                password,
                email,
                photo: username.substr(0, 1)
            }, {
                transaction: t
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
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
                transaction: t,
                where: {
                    email
                }
            })
            .then(create)
    })
    .then(respond)
    .catch(onError)
}

/** 로그인 */
const login = (req, res) => {
    let t
    const {
        email,
        password
    } = req.body

    const check = (user) => {
        if (!user) {
            throw new Error('NOAUTH')
        } else {
            if (user.password === password) {
                const p = new Promise((resolve, reject) => {
                    jwt.sign({
                            uid: user.uid,
                            username: user.username,
                            email: user.email
                        },
                        salt, {}, (err, token) => {
                            if (err) reject(err)
                            resolve({token, username: user.username})
                        })
                })
                return p
            } else {
                throw new Error("NOAUTH")
            }
        }
    }

    const respond = ({token, username}) => {
        res.json({
            message: "로그인에 성공하였습니다.",
            token,
            data: {username},
            result: true
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
            where: {
                email
            }
        }).then(check)
    })
    .then(respond)
    .catch(onError)
}

/** 회원정보 가져오기 */
const getInfo = (req, res) => {
    let t
    const decoded = req.decoded;

    const respond = (user) => {
        res.json({
            result: true,
            user
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
            where: {
                uid: decoded.uid
            },
            attributes: ['uid', 'username', 'email', 'photo'],
            transaction: t
        })
    }).then(respond)
    .catch(onError)
}

/** 회원 정보 업데이트 */
const updateInfo = (req, res) => {
    let t
    const {
        email
    } = req.body

    const respond = () => {
        res.json({
            result: true,
            message: "회원 정보 수정에 성공하셨습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    model.sequelize.transaction(transaction => {
        t = transaction
        return User.update({
            email
        }, {
            transaction: t,
            where: {
                uid: user.uid
            }
        })
    }).then(respond)
    .catch(onError)
}

/** reset code 검증 */
const verifyResetCode = (req, res) => {
    let t
    const {
        uid,
        resetCode
    } = req.query

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
            transaction: t,
            where: {
                uid,
                reset_code: resetCode
            }
        }).then((user) => {
            if (user) {
                return;
            } else {
                throw new Error("NOCODE")
            }
        })
    }).then(() => {
        res.json({
            result: true
        })
    }).catch(onError)
}

/* reset code 삭제 */
const deleteResetCode = (req, res) => {
    let t
    const {
        uid,
        resetCode
    } = req.query

    const deleteCode = (user) => {
        if (user) {
            return User.update({
                reset_code: null,
                reset_code_expiredate: null
            }, {
                where: {
                    uid,
                    reset_code: resetCode
                },
                transaction: t
            })
        } else {
            throw new Error("NOCODE")
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "성공적으로 코드를 파기했습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
            transaction: t,
            where: {
                uid,
                reset_code: resetCode
            }
        }).then(deleteCode)
    }).then(respond)
    .catch(onError)
}

/** reset code 발급 */
const issueResetCode = (req, res) => {
    let t
    const {
        email
    } = req.body

    const generateCode = (user) => {
        if (!user) {
            throw new Error("NOAUTH")
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
                },
                transaction: t
            })
        }
    }

    const getUserData = () => {
        return User.findOne({
            transaction: t,
            attributes: ["uid", "username", "reset_code"],
            where: {
                email
            }
        })
    }

    const sendMail = (user) => {
        let {
            uid,
            username,
            reset_code
        } = user
        let reset_url = `http://localhost:8080/reset?uid=${uid}&resetCode=${reset_code}&reset=true`
        let dont_reset_url = `http://localhost:8080/reset?uid=${uid}&resetCode=${reset_code}&reset=false`
        let mailOption = {
            from: mailConfig.user,
            to: email,
            subject: 'Trello Password Reset',
            html: `<div style="font: 15px 'Helvetica Neue',Arial,Helvetica;background-color: #F0F0F0; height: 420px; color: #333;">
            <table style="color: #333;padding: 0;margin: 0;width: 100%;font: 15px 'Helvetica Neue',Arial,Helvetica;">
                <tbody>
                    <tr width="100%">
                        <td>
                            <table style="border: none;padding: 0px 18px;margin: 50px auto;width: 500px;">
                                <tbody>
                                    <tr width="100%" height="57">
                                        <td style="background-color: #0079bf; border-top-left-radius: 4px;border-top-right-radius: 4px;text-align: center;padding: 12px 18px;"><img
                                                width="120px" src="https://trello.com/images/email-header-logo-white-v2.png" alt=""></td>
                                    </tr>
                                    <tr width="100%">
                                        <td style="background: #fff; padding: 18px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">
                                            <div style="font-weight: bold;font-size: 20px;color: #333;margin: 0;">Hello ${username},</div>
                                            <p style="font-size: 15px; color: #333;">We heard you need a password reset. Click the link below
                                                and you'll be redirected to a secure site from which you can set a new password.</p>
                                            <p style="text-align: center; color: #333; font-size: 15px;"><a href="${reset_url}" target="_blank" style="background-color: #3aa54c;border-radius: 3px;text-decoration: none;color: #fff;line-height: 1.25em;font-size: 16px;font-weight: 700;padding: 10px 18px;margin: 24px auto 24px;display: block;width: 180px;">Reset Password</a></p>
                                            <p style="color: #939393">If you didn't try to reset your password, <a href="${dont_reset_url}" style="color: #365FC9">click here</a> and we'll forget this ever happened.</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`
        }
        smtpTransport.sendMail(mailOption, function (err, info) {
            if (err) {
                console.error('Send Mail error : ', error)
                throw new Error('MAILFAIL')
            } else {
                console.log(info)
                return;
            }
        })
    }

    const respond = () => {
        res.json({
            result: true,
            message: "코드를 발급했습니다. 이메일을 확인해주세요."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
                transaction: t,
                where: {
                    email
                },
                attributes: ['uid', 'username', 'email']
            }).then(generateCode)
            .then(getUserData)
            .then(sendMail)
    })
    .then(respond)
    .catch(onError)
}

/** 비밀번호 변경 */
const updatePassword = (req, res) => {
    let t
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
            throw new Error("NOAUTH")
        } else {
            if (verify(user)) {
                return User.update({
                    password,
                    reset_code: null,
                    reset_code_expiredate: null
                }, {
                    where: {
                        username: user.username
                    },
                    transaction: t
                })
            } else {
                throw new Error("NOCODE")
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
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findOne({
            where: {
                uid
            },
            attributes: ["uid", "username", "reset_code", "reset_code_expiredate"],
            transaction: t
        }).then(check)
    })
    .then(respond)
    .catch(onError)
}

/** 이메일로 유저 리스트 가져오기 */
const getUserList = (req, res) => {
    let t
    const {
        email
    } = req.params

    const respond = (user) => {
        res.json({
            result: true,
            data: user
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return User.findAll({
            where: {
                email: {
                    [Op.like]: email + "%"
                }
            },
            transaction: t,
            attributes: ["uid", "email", "username", "photo"]
        })
    }).then(respond)
    .catch(onError)
}

module.exports = {
    join,
    login,
    getInfo,
    updateInfo,
    verifyResetCode,
    issueResetCode,
    deleteResetCode,
    updatePassword,
    getUserList
}

