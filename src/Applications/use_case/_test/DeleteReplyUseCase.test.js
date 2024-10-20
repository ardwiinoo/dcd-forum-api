const DeleteReplyUseCase = require('../DeleteReplyUseCase')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')

describe('DeleteReplyUseCase', () => {
    it('should orchestrating delete reply correctly', async () => {
        // Arrange
        const params = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            replyId: 'reply-123',
        }

        const owner = 'user-123'

        // Mocking
        const mockReplyRepository = new ReplyRepository()

        mockReplyRepository.verifyReplyAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve())

        mockReplyRepository.verifyReplyOwner = jest
            .fn()
            .mockImplementation(() => Promise.resolve())

        mockReplyRepository.deleteReplyById = jest
            .fn()
            .mockImplementation(() => Promise.resolve())

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
        })

        // Action
        await deleteReplyUseCase.execute(params, owner)

        // Assert
        expect(mockReplyRepository.verifyReplyAvailability).toBeCalledWith({
            threadId: params.threadId,
            commentId: params.commentId,
            replyId: params.replyId,
        })

        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
            replyId: params.replyId,
            owner,
        })

        expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
            params.replyId
        )
    })
})
