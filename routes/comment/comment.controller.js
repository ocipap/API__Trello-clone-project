const models = require('../../models')
const Card = models.db.card
const Comment = models.db.comment
const ErrorHandler = require('../../middlewares/error').ErrorHandler

const addComment = (req, res) => {
    let t
    const decoded = req.decoded
    const {cid, comment} = req.body

    const add = (card) => {
        if(!card) {
            throw new Error("NOTFOUND")
        } else {
            return Comment.create({
                cid,
                comment,
                uid: decoded.uid
            },{
                transaction: t
            })
        }
    }

    const respond = (cmt) => {
        const {comment_id} = cmt.dataValues
        res.json({
            result: true,
            data: {
                comment_id,
                cid,
                comment,
                uid: decoded.uid
            }
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
            transaction: t
        }).then(add)
    }).then(respond)
    .catch(onError)
}

const updateComment = (req, res) => {
    let t
    const {comment_id} = req.params
    const {comment} = req.body
    const decoded = req.decoded

    const update = (cmt) => {
        if(!cmt) {
            throw new Error("NOTFOUND")
        } else if(cmt.uid != decoded.uid){
            throw new Error("FORBIDDEN")
        } else {
            return Comment.update({
                comment
            },{
                where: {
                    comment_id
                },
                transaction: t
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "성공적으로 댓글을 수정하였습니다"
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }
    
    models.sequelize.transaction(transaction => {
        t = transaction
        return Comment.findOne({
            where: {
                comment_id
            },
            transaction: t
        }).then(update)
    }).then(respond)
    .catch(onError)
}

const deleteComment = (req, res) => {
    let t
    const {comment_id} = req.params
    const decoded = req.decoded

    const remove = (cmt) =>{
        if(!cmt) {
            throw new Error("NORFOUND")
        } else if(cmt.uid != decoded.uid){
            throw new Error("FORBIDDEN")
        } else {
            return Comment.destroy({
                where: {
                    comment_id
                },
                transaction: t
            })
        }
    }

    const respond = () => {
        res.json({
            result: true,
            message: "성공적으로 댓글을 삭제하였습니다."
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }
    
    models.sequelize.transaction(transaction => {
        t = transaction
        return Comment.findOne({
            where: {
                comment_id
            },
            transaction: t
        }).then(remove)
    }).then(respond)
    .catch(onError)
}

module.exports = {
    addComment,
    updateComment,
    deleteComment
}