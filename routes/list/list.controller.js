const models = require('../../models')
const User = models.db.user
const Board = models.db.board
const List = models.db.list
const Member = models.db.member
const ErrorHandler = require('../../middlewares/error').ErrorHandler

const getListList = (req, res) => {
	let t
    const {lid} = req.params

    const boardCheck = new Promise((resolve, reject) => {
        Board.findOne({
            where: {
                bid
            },
            transaction: t,
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
            transaction: t,
        }).then(member => {
            resolve(member)
        })
    })
    
    const checkPromise = (list) => {
        if(!list) {
            throw new Error("NOTFOUND")
        } else {
            return Promise.all([boardCheck, memberCheck]).then(data => {
                const [board, member] = data
                if(!board) {
                    throw new Error("NOTFOUND")
                } else if(!member) {
                    throw new Error("FORBIDDEN")
                } else if(list.cards.length == 0) {
                    return null
                } else {
                    return list
                }
            })
        }
    }

	const respond = (list) => {
		if(!list) {
            res.status(204).send()
        } else {
            res.json({
                result: true,
                data: list
            })
        }
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

	models.sequelize.transaction(transaction => {
		t = transaction
		return List.findOne({
			where: {
				lid
            },
            attributes: [],
			include: [{
				model: Card, 
				order: [
                	['position']
				],
			}],
			transaction: t
		}).then(checkPromise)
	}).then(respond)
	.catch(onError)
}

const addList = (req, res) => {
	let t
	const decoded = req.decoded
	const { title, position, bid } = req.body

	const boardCheck = (board) => {
		if (!board) {
			throw new Error("NOTFOUND")
		} else {
			return Member.findOne({
				transaction: t,
				where: {
					uid: decoded.uid,
					bid
				}
			})
		}
	}

	const memberCheck = (member) => {
		if (!member) {
			throw new Error("FORBIDDEN")
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

	const respond = (list) => {
		const {bid, lid, title, position} = list.dataValues
		res.json({
			result: true,
			message: "정상적으로 리스트를 추가시켰습니다.",
			data: {
				lid,
				bid,
				title,
				position
			}
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
			return Board.findOne({
				transaction: t,
				where: {
					bid
				}
			}).then(boardCheck)
			.then(memberCheck)
		}
	}).then(respond)
	.catch(onError)
}

const updateList = (req, res) => {
	let t
	const decoded = req.decoded
	const {lid} = req.params
	const {title} = req.body

	const memberCheck = (list) => {
		if(!list) {
			throw new Error("NOTFOUND")
		} else {
			return Member.findOne({
				where : {
					bid : list.bid,
					uid : decoded.uid
				},
				transaction: t
			})
		}
	}

	const update = (member) => {
		if(!member) {
			throw new Error("FORBIDDEN")
		} else {
			return List.update({
				title
			}, {
				where: {
					lid
				},
				transaction: t
			})
		}
	}

	const respond = () => {
		res.json({
			result: true,
			message: "정상적으로 리스트를 수정하였습니다."
		})
    }
    
    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

	models.sequelize.transaction(transaction => {
		t = transaction
		if (title == null || title == undefined){
			throw new Error("BADREQ")
		} else {
			return List.findOne({
				where: {
					lid
				},
				transaction: t
			}).then(memberCheck)
			.then(update)
		}
	}).then(respond)
	.catch(onError)

}

const deleteList = (req, res) => {
	let t
	const decoded = req.decoded
	const {lid} = req.params

	const memberCheck = (list) => {
		if(!list) {
			throw new Error("NOTFOUND")
		} else {
			return Member.findOne({
				where : {
					bid : list.bid,
					uid : decoded.uid
				},
				transaction: t
			})
		}
	}

	const remove = (member) => {
		if(!member) {
			throw new Error("FORBIDDEN")
		} else {
			return List.destroy({
				where : {
					lid
				},
				transaction: t
			})
		}
	}

	const respond = () => {
		res.json({
			result: true,
			message : "정상적으로 리스트를 삭제하였습니다."
		})
    }    

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }


	models.sequelize.transaction(transaction => {
		t = transaction
		return List.findOne({
			where : {
				lid
			},
			transaction: t
		}).then(memberCheck)
		.then(remove)
	}).then(respond)
	.catch(onError)

}

const moveList = (req, res) => {
	let t
	const decoded = req.decoded
	const {lid} = req.params
	const {position} = req.body

	const memberCheck = (list) => {
		if(!list) {
			throw new Error("NOTFOUND")
		} else {
			return Member.findOne({
				where : {
					bid : list.bid,
					uid : decoded.uid
				},
				transaction: t
			})
		}
	}

	const update = (member) => {
		if(!member) {
			throw new Error("FORBIDDEN")
		} else {
			return List.update({
				position
			}, {
				where: {
					lid
				},
				transaction: t
			})
		}
	}

	const respond = () => {
		res.json({
			result: true,
			message: "정상적으로 리스트를 수정하였습니다."
		})
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

	models.sequelize.transaction(transaction => {
		t = transaction
		if (position == null || position == undefined){
			throw new Error("BADREQ")
		} else {
			return List.findOne({
				where: {
					lid
				},
				transaction: t
			}).then(memberCheck)
			.then(update)
		}
	}).then(respond)
	.catch(onError)
}

module.exports = {
	getListList,
	addList,
	updateList,
	deleteList,
	moveList
}