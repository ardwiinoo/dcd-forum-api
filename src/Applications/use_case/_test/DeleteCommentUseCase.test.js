const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')

describe('DeleteCommentUseCase', () => {
    it('should orchestrating delete comment correctly', async () => {
        // Arrange
        const params = {
            commentId: 'comment-123',
            threadId: 'thread-123',
        }

        const owner = 'user-123'

        // creating dependency of use case
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
        await deleteCommentUseCase.execute(params, owner)

        // Assert
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith({
            commentId: params.commentId,
            threadId: params.threadId,
        })
        expect(mockCommentRepository.validateCommentOwner).toBeCalledWith({
            commentId: params.commentId,
            owner,
        })
        expect(mockCommentRepository.deleteComment).toBeCalledWith(
            params.commentId
        )
    })
})
