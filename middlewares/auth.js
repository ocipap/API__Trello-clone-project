const jwt = require('jsonwebtoken')
const { salt } = require('../config/auth.config')

const authMiddleware = (req, res, next) => {
    const token = req.headers['token']

    if (!token) {
        return res.status(403).json({
            success: false,
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
            success: false,
            message: error.message
        })
    }

    p.then((decoded) => {
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware