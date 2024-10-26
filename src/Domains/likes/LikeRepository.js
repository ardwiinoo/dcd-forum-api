class LikeRepository {
    async likeComment(newLike) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async unlikeComment(newLike) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyLikeComment(newLike) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getLikeCountByCommentId(commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = LikeRepository
