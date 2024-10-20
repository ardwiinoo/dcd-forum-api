const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase')

class RepliesHandler {
    constructor(container) {
        this._container = container

        this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this)
        this.deleteCommentReplyHandler =
            this.deleteCommentReplyHandler.bind(this)
    }

    async postCommentReplyHandler(request, h) {
        const { id: userId } = request.auth.credentials

        const addReplyUseCase = this._container.getInstance(
            AddReplyUseCase.name
        )
        const addedReply = await addReplyUseCase.execute(
            request.payload,
            request.params,
            userId
        )

        return h
            .response({
                status: 'success',
                data: {
                    addedReply,
                },
            })
            .code(201)
    }

    async deleteCommentReplyHandler(request, h) {
        const { id: userId } = request.auth.credentials

        const deleteReplyUseCase = this._container.getInstance(
            DeleteReplyUseCase.name
        )
        await deleteReplyUseCase.execute(request.params, userId)

        return h
            .response({
                status: 'success',
            })
            .code(200)
    }
}

module.exports = RepliesHandler
