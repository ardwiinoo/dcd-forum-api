class DeleteCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository
    }

    async execute(useCasePayload) {
        const { commentId, threadId, owner } = useCasePayload

        await this._commentRepository.verifyCommentAvailability(
            commentId,
            threadId
        )
        await this._commentRepository.validateCommentOwner(
            commentId,
            threadId,
            owner
        )
        await this._commentRepository.deleteComment(commentId)
    }
}

module.exports = DeleteCommentUseCase
