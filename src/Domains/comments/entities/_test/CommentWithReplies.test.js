const CommentWithReplies = require('../CommentWithReplies')

describe('a CommentWithReplies entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            replies: [],
            likeCount: 0,
        }

        // Action and Assert
        expect(() => new CommentWithReplies(payload)).toThrowError(
            'COMMENT_WITH_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            comment: {
                id: 'comment-123',
                username: true,
                date: '2021-08-13T05:17:13.024Z',
                content: 789,
            },
            replies: [],
            likeCount: 5,
        }

        // Action and Assert
        expect(() => new CommentWithReplies(payload)).toThrowError(
            'COMMENT_WITH_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })

    it('should create CommentWithReplies object correctly', () => {
        // Arrange
        const payload = {
            comment: {
                id: 'comment-123',
                username: 'user-123',
                date: '2021-08-13T05:17:13.024Z',
                content: 'sebuah komentar',
            },
            replies: [
                {
                    id: 'reply-123',
                    username: 'user-456',
                    date: '2021-08-13T06:17:13.024Z',
                    content: 'sebuah balasan',
                },
            ],
            likeCount: 2,
        }

        // Action
        const commentWithReplies = new CommentWithReplies(payload)

        // Assert
        expect(commentWithReplies.id).toEqual(payload.comment.id)
        expect(commentWithReplies.username).toEqual(payload.comment.username)
        expect(commentWithReplies.date).toEqual(payload.comment.date)
        expect(commentWithReplies.content).toEqual(payload.comment.content)
        expect(commentWithReplies.likeCount).toEqual(payload.likeCount)
        expect(commentWithReplies.replies).toHaveLength(1)
        expect(commentWithReplies.replies[0].id).toEqual(payload.replies[0].id)
        expect(commentWithReplies.replies[0].username).toEqual(
            payload.replies[0].username
        )
        expect(commentWithReplies.replies[0].date).toEqual(
            payload.replies[0].date
        )
        expect(commentWithReplies.replies[0].content).toEqual(
            payload.replies[0].content
        )
    })
})
