const models = require('../../models')
const User = models.db.user
const Board = models.db.board
const Member = models.db.member
const uuidv4 = require("uuid/v4")

exports.getBoardList = (req, res) => {
    let t
    const decoded = req.decoded

    const check = (user) => {
        if (!user) {
            throw new Error("존재하지 않는 유저입니다.")
        } else {
            return Board.findAll({
                where: {
                    user_id: user.uid
                },
                order: [
                    ['created_at', "DESC"]
                ],
                transaction: t
            })
        }
    }

    const respond = (board) => {
        if (board.length == 0) {
            res.json({
                result: true,
                message: "No Content"
            }).status(204)
            return;
        } else {
            res.json({
                result: true,
                board
            })
        }

    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json({
            result: false,
            message: error.message
        })
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return User.findOne({
                where: {
                    uid: decoded.uid
                },
                attributes: ["uid", "username"],
                transaction: t
            }).then(check)
        }).then(respond)
        .catch(onError)
}

exports.addBoard = (req, res) => {
    let t
    const decoded = req.decoded
    const {
        title,
        bg_type,
        background
    } = req.body

    const check = (user) => {
        if (!user) {
            throw new Error("존재하지 않는 유저입니다.")
        } else if (title === undefined || title === null) {
            throw new Error("제목은 필수 항목 입니다.")
        } else {
            return Board.create({
                user_id: user.uid,
                title,
                bg_type,
                background
            }, {
                transaction: t
            })
        }
    }

    const addMemeber = (board) => {
        let {
            bid,
            user_id
        } = board.dataValues
        return Member.create({
            bid: bid,
            uid: user_id
        }, {
            transaction: t
        })
    }

    const reponde = (result) => {
        res.json({
            result: true,
            message: "정상적으로 보드를 추가시켰습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json({
            result: false,
            message: error.message
        })
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return User.findOne({
                    where: {
                        uid: decoded.uid
                    },
                    attributes: ["uid", "username"],
                    transaction: t
                }).then(check)
                .then(addMemeber)
        }).then(reponde)
        .catch(onError)
}

exports.updateBoard = (req, res) => {
    let t
    const decoded = req.decoded
    const {
        bid
    } = req.params
    const {
        title,
        bg_type,
        background
    } = req.body

    const userCheck = (user) => {
        if (!user) {
            throw new Error("존재하지 않는 유저입니다.")
        } else {
            return Member.findOne({
                where: {
                    bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const memberCheck = (member) => {
        if (!member) {
            throw new Error("권한이 없습니다.")
        } else {
            return Board.findOne({
                where: {
                    bid
                },
                attributes: ["bid"],
                transaction: t
            })
        }
    }

    const update = (board) => {
        if (!board) {
            throw new Error("존재하지 않는 보드입니다.")
        } else {
            if (title != undefined && bg_type != undefined) {
                return Board.update({
                    title,
                    bg_type,
                    background
                }, {
                    where: {
                        bid
                    },
                    transaction: t
                })
            } else if (title != undefined) {
                return Board.update({
                    bg_type,
                    background
                }, {
                    where: {
                        bid
                    },
                    transaction: t
                })
            } else {
                return Board.update({
                    bg_type,
                    background
                }, {
                    where: {
                        bid
                    },
                    transaction: t
                })
            }

        }
    }

    const reponde = (result) => {
        res.json({
            result: true,
            message: "보드 수정에 성공하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json({
            result: false,
            message: error.message
        })

    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return User.findOne({
                    where: {
                        uid: decoded.uid
                    },
                    attributes: ["uid", "username"],
                    transaction: t
                }).then(userCheck)
                .then(memberCheck)
                .then(update)
        }).then(reponde)
        .catch(onError)
}

exports.deleteBoard = (req, res) => {
    let t
    const decoded = req.decoded
    const {
        bid
    } = req.params

    const userCheck = (user) => {
        if (!user) {
            throw new Error("존재하지 않는 유저입니다.")
        } else {
            return Member.findOne({
                where: {
                    bid,
                    uid: user.uid
                },
                transaction: t
            })
        }
    }

    const memberCheck = (member) => {
        if (!member) {
            throw new Error("삭제할 수 있는 권한이 없습니다.")
        } else {
            return Board.destroy({
                where: {
                    bid
                },
                transaction: t
            })
        }
    }

    const respond = (result) => {
        res.json({
            result: true,
            message: "보드 삭제에 성공하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error.message)
        res.status(400).json({
            result: false,
            message: error.message
        })
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return User.findOne({
                    where: {
                        uid: decoded.uid
                    },
                    attributes: ["uid", "username"],
                    transaction: t
                }).then(userCheck)
                .then(memberCheck)
                .then(deleteBoard)
        }).then(respond)
        .catch(onError)
}

exports.getMemeberList = (req, res) => {
    let t
    const decoded = req.decoded
    const {
        bid
    } = req.params

    const userCheck = (user) => {
        if (!user) {
            throw new Erorr("존재하지 않은 유저입니다.")
        } else {
            return Board.findOne({
                where: {
                    bid
                },
                attributes: ["bid"],
                transaction: t
            })
        }
    }

    const getMember = (board) => {
        if (!board) {
            throw new Error("존재하지 않은 보드입니다.")
        } else {
            return Member.findAll({
                where: {
                    bid: board.bid
                },
                transaction: t,
                include: [{model: User, attributes: ['username', 'photo', 'email']}]
            })
        }
    }

    const respond = (member) => {
        if (member.length == 0) {
            res.json({
                result: true,
                message: "No Content"
            }).status(204)
        } else{
            res.json({
                result : true,
                data : member
            })
        }
    }

    const onError = (error) => {
        console.error(error.message)
        res.status(400).json({
            result: false,
            message: error.message
        })
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return User.findOne({
                    where: {
                        uid: decoded.uid
                    },
                    attributes: ["uid", "username"],
                    transaction: t
                }).then(userCheck)
                .then(getMember)
        }).then(respond)
        .catch(onError)
}

exports.addMember = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid} = req.params
    const {uid} = req.body

    models.sequelize.transaction(transaction => {
        t = transaction
        
    })
}