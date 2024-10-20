const AddReply = require('../../Domains/replies/entities/AddReply')

class AddReplyUseCase {
    constructor({ commentRepository, replyRepository }) {
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async execute(payload, params, owner) {
        const { threadId, commentId } = params

        await this._commentRepository.verifyCommentAvailability({
            commentId,
            threadId,
        })

        const newReply = new AddReply({
            ...payload,
            owner,
            commentId,
        })

        return this._replyRepository.addReply(newReply)
    }
}

module.exports = AddReplyUseCase
