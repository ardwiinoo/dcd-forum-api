class DeleteCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository
    }

    async execute(useCaseParams, userId) {
        const { commentId, threadId } = useCaseParams

        await this._commentRepository.verifyCommentAvailability({
            commentId,
            threadId,
        })

        await this._commentRepository.validateCommentOwner({
            commentId,
            owner: userId,
        })

        await this._commentRepository.deleteComment(commentId)
    }
}

module.exports = DeleteCommentUseCase
