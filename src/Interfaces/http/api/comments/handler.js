const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
    constructor(container) {
        this._container = container

        this.postCommentHandler = this.postCommentHandler.bind(this)
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    }

    async postCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials

        const addCommentUseCase = this._container.getInstance(
            AddCommentUseCase.name
        )
        const addedComment = await addCommentUseCase.execute(
            request.payload,
            request.params,
            userId
        )

        return h
            .response({
                status: 'success',
                data: {
                    addedComment,
                },
            })
            .code(201)
    }

    async deleteCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials

        const deleteCommentUseCase = this._container.getInstance(
            DeleteCommentUseCase.name
        )
        await deleteCommentUseCase.execute(request.params, userId)

        return h
            .response({
                status: 'success',
            })
            .code(200)
    }
}

module.exports = CommentsHandler
