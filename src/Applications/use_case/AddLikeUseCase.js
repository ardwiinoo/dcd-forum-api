const AddLike = require('../../Domains/likes/entities/AddLike')

class AddLikeUseCase {
    constructor({ likeRepository, commentRepository }) {
        this._likeRepository = likeRepository
        this._commentRepository = commentRepository
    }

    async execute(params, owner) {
        const { threadId, commentId } = params

        await this._commentRepository.verifyCommentAvailability(
            commentId,
            threadId
        )

        const newLike = new AddLike({
            commentId,
            owner,
        })

        const isLiked = await this._likeRepository.verifyLikeComment(newLike)

        return isLiked
            ? await this._likeRepository.unlikeComment(newLike)
            : await this._likeRepository.likeComment(newLike)
    }
}

module.exports = AddLikeUseCase
