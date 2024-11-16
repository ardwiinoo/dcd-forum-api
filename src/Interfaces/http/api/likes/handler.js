const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase')

class LikeCommentHandler {
    constructor(container) {
        this._container = container
        this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this)
    }

    async putLikeCommentHandler(request, h) {
        const { id: owner } = request.auth.credentials
        const { threadId, commentId } = request.params

        const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name)
        await addLikeUseCase.execute({ threadId, commentId }, owner)

        return h
            .response({
                status: 'success',
            })
            .code(200)
    }
}

module.exports = LikeCommentHandler
