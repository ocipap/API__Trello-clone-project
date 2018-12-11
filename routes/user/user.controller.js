const jwt = require('jsonwebtoken')
const User = require('../../models').db.user
const salt = require('../../config/auth.config').salt


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

exports.login = (req, res) => {
    const {
        username,
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
        res.status(401).json({
            message: error.message,
            result: false
        })
    }

    User.findOne({
            where: {
                username
            }
        }).then(check)
        .then(respond)
        .catch(onError)
}

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
        res.status(401).json({
            message: error.message,
            result: false
        })
    }

    User.findOne({
            where: {
                uid: decoded.uid
            },
            attributes: {
                include: ['uid', 'username', 'email', 'photo']
            }
        }).then(check)
        .then(respond)
        .catch(onError)
}