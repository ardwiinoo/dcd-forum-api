const AddReplyUseCase = require('../AddReplyUseCase')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddReply = require('../../../Domains/replies/entities/AddReply')

describe('AddReplyUseCase', () => {
    it('should orchestrate the add reply action correctly', async () => {
        // Arrange
        const payload = { content: 'sebuah reply' }
        const params = { threadId: 'thread-123', commentId: 'comment-123' }
        const owner = 'user-123'

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: payload.content,
            owner,
        })

        // Mocking
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve())
        mockReplyRepository.addReply = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new AddedReply({
                    id: 'reply-123',
                    content: payload.content,
                    owner,
                })
            )
        )

        const addReplyUseCase = new AddReplyUseCase({
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        })

        // Act
        const addedReply = await addReplyUseCase.execute(payload, params, owner)

        // Assert
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith({
            commentId: params.commentId,
            threadId: params.threadId,
        })

        expect(mockReplyRepository.addReply).toBeCalledWith(
            new AddReply({
                content: payload.content,
                owner,
                commentId: params.commentId,
            })
        )

        expect(addedReply).toStrictEqual(expectedAddedReply)
    })
})
