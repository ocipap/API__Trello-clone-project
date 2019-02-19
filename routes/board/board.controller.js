const models = require('../../models')
const User = models.db.user
const Board = models.db.board
const List = models.db.list
const Member = models.db.member
const ErrorHandler = require('../../middlewares/error')

exports.getBoardList = (req, res) => {
    let t
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
                data: board
            })
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return Member.findAll({
                where: {
                    uid: user.uid
                },
                order: [
                    ['created_at', "DESC"]
                ],
                transaction: t,
                include: [{model: Board}]
            })
        }).then(respond)
        .catch(onError)
}

exports.getBoard = (req, res) => {
    let t
    const {bid}  = req.params

    const respond = (board) => {
        if(!board){
            throw new Error("NOTFOUND")
        }else {
            res.json({
                result: true,
                data: board
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

        return Board.findOne({
            where: {
                bid
            },
            transaction: t,
            include: [{model: List}]
        })
    }).then(respond)
    .catch(onError)
}

exports.addBoard = (req, res) => {
    let t
    const {
        title,
        bg_type,
        background
    } = req.body

    const addMemeber = (board) => {
        let {
            bid,
            user_id
        } = board.dataValues
        return Member.create({
            bid: bid,
            uid: user_id,
            permission: "Admin"
        }, {
            transaction: t
        })
    }

    const respond = () => {
        res.json({
            result: true,
            message: "정상적으로 보드를 추가시켰습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            if (title === undefined || title === null) {
                throw new Error("BADREQ")
            } else {
                return Board.create({
                    user_id: user.uid,
                    title,
                    bg_type,
                    background
                }, {
                    transaction: t
                })
                .then(addMemeber)
            }
        }).then(respond)
        .catch(onError)
}

exports.addList = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid} = req.params
    const {
        title,
        position
    } = req.body

    const addList = (member) => {
        if(!member){
            throw new Error("NOAUTH")
        } else {
            return List.create({
                bid,
                title,
                position,
            }, {
                transaction: t
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "정상적으로 보드를 추가시켰습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        if (title === undefined || title === null || 
            position === undefined || position === null) {
            throw new Error("BADREQ")
        } else {
            return Member.findOne({
                transaction: t,
                where : {
                    uid: decoded.uid,
                    bid
                }
            }).then(addList)
        }
    }).then(respond)
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

    const memberCheck = (member) => {
        if (!member) {
            throw new Error("FORBIDDEN")
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
            throw new Error("NOTFOUND")
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

    const respond = (result) => {
        res.json({
            result: true,
            message: "보드 수정에 성공하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(401).json(ErrorHandler(error.message))

    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return Member.findOne({
                where: {
                    bid,
                    uid: decoded.uid
                },
                transaction: t
            })
            .then(memberCheck)
            .then(update)
        }).then(respond)
        .catch(onError)
}

exports.deleteBoard = (req, res) => {
    let t
    const {
        bid
    } = req.params

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
            return Member.findOne({
                where: {
                    bid,
                    uid: user.uid,
                    permission: "Admin"
                },
                transaction: t
            })
            .then(memberCheck)
            .then(deleteBoard)
        }).then(respond)
        .catch(onError)
}

exports.getMemeberList = (req, res) => {
    let t
    const {
        bid
    } = req.params


    const getMember = (board) => {
        if (!board) {
            throw new Error("NOTFOUND")
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
            return Board.findOne({
                where: {
                    bid
                },
                attributes: ["bid"],
                transaction: t
            })
            .then(getMember)
        }).then(respond)
        .catch(onError)
}

exports.addMember = (req, res) => {
    let t
    const {bid} = req.params
    const {uid} = req.body

    const userCheck = (user) => {
        if(!user) {
            throw new Error("NOAUTH")
        } else {
            
        }
    }

    const memberCheck = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Member.findOne({
                where : {
                    bid: member.bid,
                    uid : uid
                },
                transaction : t,
                attributes : ["bid"]
            })
        }
    }

    const isMember = (member) => {
        if(member) {
            throw new Error("EXIST")
        } else {
            return Member.create({
                bid: member.bid,
                uid: uid,
                permission: "Normal"
            }, {
                transaction : t
            })
        }
    }

    const respond = (result) => {
        res.json({
            result : true,
            message : "멤버를 정상적으로 추가시켰습니다."
        })
    }

    const onError = (error) => {
        console.error(error.message)
        res.status(400).json({
            result: false,
            message : error.message
        })
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Member.findOne({
            where : {
                bid : bid,
                uid : user.uid,
                permission: "Admin"
            },
            transaction : t,
            attributes : ["bid"]
        })
        .then(memberCheck)
        .then(isMember)
    }).then(respond)
    .catch(onError)
}

exports.deleteMember = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid, uid} = req.params


    const memberCheck = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Member.findOne({
                where: {
                    bid,
                    uid
                },
                transaction: t
            })
        }
    }

    const isMember = (member) => {
        if(!member){
            throw new Error("NOAUTH")
        } else {
            return Member.destroy({
                where:{
                    bid,
                    uid
                },
                transaction : t
            })
        }
    }

    const respond = (result) => {
        res.json({
            result: true,
            message : "멤버를 정상적으로 삭제하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error.message)
        res.status(400).json({
            result: false,
            message : error.message
        })
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Member.findOne({
            where: {
                bid,
                uid: decoded.uid,
                permission: "ADMIN"
            },
            transaction: t
        })
        .then(memberCheck)
        .then(isMember)
    }).then(respond)
    .catch(onError)
}