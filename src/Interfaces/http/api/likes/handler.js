const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase')

class LikeCommentHandler {
    constructor(container) {
        this._container = container
        this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this)
    }

    async putLikeCommentHandler(requst, h) {
        const { id: owner } = requst.auth.credentials
        const { threadId, commentId } = requst.params

        const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name)
        await addLikeUseCase.execute({ commentId, threadId }, owner)

        return h
            .response({
                status: 'success',
            })
            .code(200)
    }
}

module.exports = LikeCommentHandler
