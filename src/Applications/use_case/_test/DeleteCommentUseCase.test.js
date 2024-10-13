const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-123',
        }

        // creating dependencies of use case
        const mockCommentRepository = new CommentRepository()

        // mocking needed function
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.validateCommentOwner = jest
            .fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.deleteComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve())

        // creating use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
        })

        // Action
        await deleteCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
            useCasePayload.commentId,
            useCasePayload.threadId
        )
        expect(mockCommentRepository.validateCommentOwner).toBeCalledWith(
            useCasePayload.commentId,
            useCasePayload.threadId,
            useCasePayload.owner
        )
        expect(mockCommentRepository.deleteComment).toBeCalledWith(
            useCasePayload.commentId
        )
    })
})
