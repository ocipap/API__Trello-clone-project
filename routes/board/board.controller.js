const models = require('../../models')
const User = models.db.user
const Board = models.db.board
const List = models.db.list
const Member = models.db.member
const Activity = models.db.activity
const ErrorHandler = require('../../middlewares/error').ErrorHandler

const getBoardList = (req, res) => {
    let t
    const decoded = req.decoded

    const respond = (board) => {
        if (board.length == 0) {
            res.status(204).send()
        } else {
            res.json({
                result: true,
                data: board
            })
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Member.findAll({
            where: {
                uid: decoded.uid
            },
            order: [
                ['created_at', "DESC"]
            ],
            attributes: [],
            transaction: t,
            include: [{model: Board}]
        })
    }).then(respond)
    .catch(onError)
}

const getBoard = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid}  = req.params

    const boardCheck = new Promise((resolve, reject) => {
        Board.findOne({
            where: {
                bid
            },
            transaction: t,
            attributes: [],
            include: [{
                model: List,
                order: [
                    ['position']
                ],
            }]
        }).then(board => {
            resolve(board)
        })
    })

    const memberCheck = new Promise((resolve, reject) => {
        Member.findOne({
            where: {
                uid: decoded.uid,
                bid
            },
            transaction: t
        }).then(member => {
            resolve(member)
        })
    })

    const respond = (board) => {
        if(board == null) {
            res.status(204).send()
        } else {
            res.json({
                result: true,
                data: board
            })
        }
        
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Promise.all([boardCheck, memberCheck]).then(data => {
            const [board, member] = data
            if(!board) {
                throw new Error("NOTFOUND")
            } else if(!member) {
                throw new Error("FORBIDDEN")
            } else if(board.lists.length == 0) {
                return null
            } else {
                return board.lists
            }
        })
    }).then(respond)
    .catch(onError)
}

const getBoardActivity = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid} = req.params

    const boardCheck = new Promise((resolve, reject) => {
        Board.findOne({
            where: {
                bid
            },
            transaction: t,
            attributes: [],
            include: [{
                model: Activity,
                include: [{
                    model: User,
                    attributes: ['username', 'photo', 'email']
                }]
            }]
        }).then(board => {
            resolve(board)
        })
    })

    const memberCheck = new Promise((resolve, reject) => {
        Member.findOne({
            where: {
                uid: decoded.uid,
                bid
            },
            transaction: t
        }).then(member => {
            resolve(member)
        })
    })

    const respond = (board) => {
        if(!board) {
            res.json({
                result: true,
                message: 'No Content'
            })
        } else {
            res.json({
                result: true,
                data: board
            })
        }
        
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Promise.all([boardCheck, memberCheck]).then(data => {
            const [board, member] = data
            if(!board) {
                throw new Error("NOTFOUND")
            } else if(!member) {
                throw new Error("FORBIDDEN")
            } else if (board.activities.length == 0){
                return null
            }else {
                return board
            }
        })
    }).then(respond)
    .catch(onError)
}

const getBoardActivityByUser = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid, uid} = req.params

    const boardCheck = new Promise((resolve, reject) => {
        Board.findOne({
            where: {
                bid
            },
            transaction: t,
            attributes: [],
            include: [{
                model: Activity,
                where: {uid},
                include: [{
                    model: User,
                    attributes: ['username', 'photo', 'email']
                }]
            }]
        }).then(board => {
            resolve(board)
        })
    })

    const memberCheck = new Promise((resolve, reject) => {
        Member.findOne({
            where: {
                uid: decoded.uid,
                bid
            },
            transaction: t
        }).then(member => {
            resolve(member)
        })
    })

    const respond = (board) => {
        if(!board) {
            res.json({
                result: true,
                message: 'No Content'
            })
        } else {
            res.json({
                result: true,
                data: board
            })
        }
        
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Promise.all([boardCheck, memberCheck]).then(data => {
            const [board, member] = data
            if(!board) {
                throw new Error("NOTFOUND")
            } else if(!member) {
                throw new Error("FORBIDDEN")
            } else if (board.activities.length == 0){
                return null
            }else {
                return board
            }
        })
    }).then(respond)
    .catch(onError)
}

const addBoard = (req, res) => {
    let t
    const decoded = req.decoded
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

    const respond = (member) => {
        const {bid, uid} = member.dataValues
        res.json({
            result: true,
            message: "정상적으로 보드를 추가시켰습니다.",
            data: {
                bid,
                uid,
                title,
                bg_type,
                background
            }
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
                    user_id: decoded.uid,
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


const updateBoard = (req, res) => {
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

    const boardCheck = (board) => {
        if(!board) {
            throw new Error("NOTFOUND")
        }else {
            return Member.findOne({
                where: {
                    bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const update = (member) => {
        if (!member) {
            throw new Error("FORBIDDEN")
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

    const respond = () => {
        res.json({
            result: true,
            message: "정상적으로 보드를 수정하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return Board.findOne({
                where: {
                    bid
                },
                transaction: t
            })
            .then(boardCheck)
            .then(update)
        }).then(respond)
        .catch(onError)
}

const deleteBoard = (req, res) => {
    let t
    const {
        bid
    } = req.params

    const boardCheck = (board) => {
        if(!board) {
            throw new Error("NOTFOUND")
        }else {

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

    const respond = () => {
        res.json({
            result: true,
            message: "정상적으로 보드를 삭제하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
            t = transaction
            return Board.findOne({
                where: {
                    bid,
                },
                transaction: t
            })
            .then(boardCheck)
            .then(memberCheck)
        }).then(respond)
        .catch(onError)
}

const getMemeberList = (req, res) => {
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
            res.status(204).send()
        } else{
            res.json({
                result : true,
                data : member
            })
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
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

const addMember = (req, res) => {
    let t
    const {bid} = req.params
    const {uid} = req.body

    const boardCheck = (board) => {
        if(!board) {
            throw new Error("NOTFOUND")
        }else {
            return Member.findOne({
                where : {
                    bid : bid,
                    uid : user.uid,
                    permission: "Admin"
                },
                transaction : t,
                attributes : ["bid"]
            })
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

    const respond = () => {
        res.json({
            result : true,
            message : "멤버를 정상적으로 추가시켰습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Board.findOne({
            where : {
                bid,
            },
            transaction : t,
            attributes : ["bid"]
        })
        .then(boardCheck)
        .then(memberCheck)
        .then(isMember)
    }).then(respond)
    .catch(onError)
}

const updateMember = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid, uid} = req.params
    const { permission } = req.body

    const boardCheck = (board) => {
        if(!board) {
            throw new Error("NOTFOUND")
        } else {
            return Member.findOne({
                where: {
                    bid,
                    uid: decoded.uid,
                    permission: "ADMIN"
                },
                transaction: t
            })
        }
    }

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
            return Member.update({
                permission
            },{
                where:{
                    bid,
                    uid
                },
                transaction : t
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message : "멤버를 정상적으로 수정하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Board.findOne({
            where: {
                bid,
            },
            transaction: t
        })
        .then(boardCheck)
        .then(memberCheck)
        .then(isMember)
    }).then(respond)
    .catch(onError)
}

const deleteMember = (req, res) => {
    let t
    const decoded = req.decoded
    const {bid, uid} = req.params

    const boardCheck = (board) => {
        if(!board) {
            throw new Error("NOTFOUND")
        } else {
            if(decoded.uid == uid) {
                return Member.findOne({
                    where: {
                        bid,
                        uid: decoded.uid,
                    },
                    transaction: t
                })
            } else {
                return Member.findOne({
                    where: {
                        bid,
                        uid: decoded.uid,
                        permission: "ADMIN"
                    },
                    transaction: t
                })
            }
        }
    }

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

    const respond = () => {
        res.json({
            result: true,
            message : "멤버를 정상적으로 삭제하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Board.findOne({
            where: {
                bid,
            },
            transaction: t
        })
        .then(boardCheck)
        .then(memberCheck)
        .then(isMember)
    }).then(respond)
    .catch(onError)
}

module.exports = {
    getBoardList,
    getBoard,
    getBoardActivity,
    getBoardActivityByUser,
    addBoard,
    updateBoard,
    deleteBoard,
    getMemeberList,
    addMember,
    updateMember,
    deleteMember
}