const CommentWithReplies = require('../../Domains/comments/entities/CommentWithReplies')

class GetThreadUseCase {
    constructor({
        threadRepository,
        commentRepository,
        replyRepository,
        likeRepository,
    }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
        this._likeRepository = likeRepository
    }

    async execute(useCaseParams) {
        const { threadId } = useCaseParams

        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getCommentsByThreadId(
            threadId
        )
        const replies = await this._replyRepository.getRepliesByThreadId(
            threadId
        )

        const commentsWithLikesAndReplies =
            await this._mapCommentsWithRepliesAndLikes(comments, replies)

        thread.comments = commentsWithLikesAndReplies
        return thread
    }

    async _mapCommentsWithRepliesAndLikes(comments, replies) {
        return Promise.all(
            comments.map(async (comment) => {
                const likeCount =
                    await this._likeRepository.getLikeCountByCommentId(
                        comment.id
                    )
                const commentReplies = replies.filter(
                    (reply) => reply.commentId === comment.id
                )
                return new CommentWithReplies({
                    comment,
                    replies: commentReplies,
                    likeCount,
                })
            })
        )
    }
}

module.exports = GetThreadUseCase
