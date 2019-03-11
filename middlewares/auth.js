const jwt = require('jsonwebtoken')
const User = require('../models').db.user
const { salt } = require('../config/auth.config')

const authMiddleware = (req, res, next) => {
    const token = req.headers['token']
    let decode_token = null

    if (!token) {
        return res.status(403).json({
            result: false,
            message: 'Not logged in'
        })
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, salt, (err, decoded) => {
                if (err) reject(err)
                resolve(decoded)
            })
        }
    )

    const onError = (error) => {
        res.status(403).json({
            result: false,
            message: error.message
        })
    }

    p.then((decoded) => {
        decode_token = decoded
        return User.findOne({
            where: {
                uid: decoded.uid
            },
            attributes: ["uid", "username"]
        })
    }).then((user) => {
        if(!user){
            throw new Error("Unauthorized")
        }
        req.decoded = decode_token
        next()
    }).catch(onError)
}

module.exports = authMiddleware