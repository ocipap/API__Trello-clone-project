const models = require('../../models')
const User = models.db.user
const Board = models.db.board
const List = models.db.list
const Card = models.db.card
const Member = models.db.member
const Comment = models.db.comment
const Activity = models.db.activity
const ErrorHandler = require('../../middlewares/error').ErrorHandler
const getActivity = require('../../middlewares/activity')

const getCardDetail = (req, res) => {
    let t
    const {cid} = req.params
    const decoded = req.decoded

    const memberCheck = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            return Member.findOne({
                where: {
                    bid: card.list.bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const getCard = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Card.findOne({
                where: {
                    cid
                },
                transaction: t
            })
        }
    }

    const respond = (card) => {
        res.json({
            result: true,
            data: card
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Card.findOne({
            where : {
                cid
            },
            include: [{
                model: List,
            }],
            transaction: t
        }).then(memberCheck)
        .then(getCard)
    }).then(respond)
    .catch(onError)
}

const getActivityByCard = (req, res) => {
    let t
    const {cid} = req.params
    const decoded = req.decoded

    const memberCheck = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            return Member.findOne({
                where: {
                    bid: card.list.bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const getActivity = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Activity.findAll({
                where: {
                    cid
                },
                order: [
                    ['created_at', "DESC"]
                ],
                include: [{
                    model: User,
                    attributes: ['username', 'photo', 'email']
                },{
                    model: Board,
                    attributes: ['title']
                }],
                transaction: t
            })
        }
    }

    const respond = (activity) => {
        if(activity.length == 0){
            res.status(204).send()
        }else {
            res.json({
                result: true,
                data: activity
            })
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Card.findOne({
            where : {
                cid
            },
            include: [{
                model: List,
            }],
            transaction: t
        }).then(memberCheck)
        .then(getActivity)
    }).then(respond)
    .catch(onError)
}

const getCommentByCard = (req, res) => {
    let t
    const {cid} = req.params
    const decoded = req.decoded

    const memberCheck = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            return Member.findOne({
                where: {
                    bid: card.list.bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const getComment = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Comment.findAll({
                where: {
                    cid
                },
                order: [
                    ['created_at', "DESC"]
                ],
                include: [{
                    model: User,
                    attributes: ['username', 'photo', 'email']
                }],
                transaction: t
            })
        }
    }

    const respond = (comment) => {
        if(comment.length == 0){
            res.status(204).send()
        }else {
            res.json({
                result: true,
                data: comment
            })
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Card.findOne({
            where : {
                cid
            },
            include: [{
                model: List,
            }],
            transaction: t
        }).then(memberCheck)
        .then(getComment)
    }).then(respond)
    .catch(onError)
}

const addCard = (req, res) => {
    let t
    const decoded = req.decoded
    const {title, lid, description, position} = req.body
    let list_title, bid = ""

    const listCheck = (list) => {
        if(!list) {
            throw new Error("NOTFOUND")
        }else {
            list_title = list.title
            bid = list.board.bid
            return Member.findOne({
                where: {
                    bid: list.bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const memberCheck = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Card.create({
                title,
                lid,
                description,
                position
            },{
                transaction: t
            })
        }
    }

    const respond = (card) => {
        const {cid} = card.dataValues
		res.json({
			result: true,
			message: "정상적으로 카드를 추가시켰습니다.",
			data: {
				cid,
				lid,
                title,
                description,
				position
			}
        })
        return {
            type: "add",
            bid,
            uid: decoded.uid,
            message: `<span class="username">${decoded.username}</span> added ${title} to ${list_title}`
        }
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
			return List.findOne({
				transaction: t,
				where: {
					lid
                },
                include: [{model: Board}]
			}).then(listCheck)
			.then(memberCheck)
		}
    }).then(respond)
    .then(getActivity)
    .catch(onError)
}

const updateCard = (req, res) => {
    let t
    const decoded = req.decoded
    const {cid} = req.params
    const {title, description} = req.body

    const memberCheck = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            return Member.findOne({
                where: {
                    bid: card.list.bid,
                    uid: decoded.uid
                },
                transaction: t
            })
        }
    }

    const update = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Card.update({
                title,
                description
            },{
                where: {
                    cid
                },
                transaction: t
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "성공적으로 카드를 수정하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Card.findOne({
            where : {
                cid
            },
            include: [{
                model: List,
            }],
            transaction: t
        }).then(memberCheck)
        .then(update)
    }).then(respond)
    .catch(onError)
}

const deleteCard = (req, res) => {
    let t
    const decoded = req.decoded
    const {cid} = req.params

    const memberCheck = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            return Member.findOne({
                where: {
                    uid: decoded.uid,
                    bid: card.list.bid
                },
                transaction: t
            })
        }
    }

    const remove = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Card.destroy({
                where: {
                    cid
                },
                transaction: t
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "정상적으로 카드를 삭제하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Card.findOne({
            where: {
                cid
            },
            include: [{
                model: List
            }],
            transaction: t
        }).then(memberCheck)
        .then(remove)
    }).then(respond)
    .catch(onError)
}

const moveCard = (req, res) => {
    let t
    const decoded = req.decoded
    const {cid} = req.params
    const {lid, position} = req.body
    let card_title, before_list, after_list = ""

    const memberCheck = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            card_title = card.title
            before_list = card.list.title
            return Member.findOne({
                where: {
                    uid: decoded.uid,
                    bid: card.list.bid
                },
                transaction: t
            })
        }
    }

    const update = (member) => {
        if(!member) {
            throw new Error("FORBIDDEN")
        } else {
            return Card.update({
                lid,
                position 
            },{
                where: {
                    cid
                },
                transaction: t
            })
        }
    }

    const getListInfo = () => {
        return List.findOne({
            where: {
                lid,
            },
            transaction: t
        })
    }

    const respond = (list) => {
        after_list = list.title
        res.json({
            result: true,
            message: "정상적으로 카드를 수정하였습니다."
        })
        return {
            type: "edit",
            bid: list.bid,
            uid: decoded.uid,
            message: `<span class="username">${decoded.username}</span> moved ${card_title} from ${before_list} to ${after_list}`
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(transaction => {
        t = transaction
        return Card.findOne({
            where: {
                cid
            },
            include: [{
                model: List
            }],
            transaction: t
        }).then(memberCheck)
        .then(update)
        .then(getListInfo)
    }).then(respond)
    .then(getActivity)
    .catch(onError)
}

module.exports = {
    getCardDetail,
    getActivityByCard,
    getCommentByCard,
    addCard,
    updateCard,
    deleteCard,
    moveCard
}