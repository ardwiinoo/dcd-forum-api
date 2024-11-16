class CommentWithReplies {
    constructor({ comment, replies, likeCount }) {
        this._verifyPayload({ comment, replies, likeCount })

        this.id = comment.id
        this.username = comment.username
        this.date = comment.date
        this.content = comment.content
        this.likeCount = likeCount
        this.replies = this._mapReplies(replies)
    }

    _verifyPayload({ comment, replies, likeCount }) {
        if (
            !comment ||
            !Array.isArray(replies) ||
            typeof likeCount !== 'number'
        ) {
            throw new Error('COMMENT_WITH_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (
            typeof comment.id !== 'string' ||
            typeof comment.username !== 'string' ||
            typeof comment.date !== 'string' ||
            typeof comment.content !== 'string'
        ) {
            throw new Error(
                'COMMENT_WITH_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
            )
        }
    }

    _mapReplies(replies) {
        return replies.map((reply) => ({
            id: reply.id,
            username: reply.username,
            date: reply.date,
            content: reply.content,
        }))
    }
}

module.exports = CommentWithReplies
