class ReplyRepository {
    async addReply(newReply) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async deleteReplyById(replyId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getRepliesByThreadId(threadId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyReplyAvailability({ threadId, commentId, replyId }) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyReplyOwner({ replyId, owner }) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = ReplyRepository
