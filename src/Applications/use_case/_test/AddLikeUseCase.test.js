const CommentRepository = require('../../../Domains/comments/CommentRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const AddLikeUseCase = require('../AddLikeUseCase')

describe('AddLikeUseCase', () => {
    it('should orchestrating the add like action correctly', async () => {
        // Arrange
        const params = {
            commentId: 'comment-123',
            threadId: 'thread-123',
        }

        const owner = 'user-123'

        const expectedResult = {
            status: 'success',
        }

        // mock dependency
        const mockCommentRepository = new CommentRepository()
        const mockLikeRepository = new LikeRepository()

        // mock function
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve())
        mockLikeRepository.verifyLikeComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve(false))
        mockLikeRepository.likeComment = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 'success',
            })
        )

        // creating use case instance
        const addLikeUseCase = new AddLikeUseCase({
            likeRepository: mockLikeRepository,
            commentRepository: mockCommentRepository,
        })

        // Action
        const addedLike = await addLikeUseCase.execute(params, owner)

        // Assert
        expect(addedLike).toStrictEqual(expectedResult)
    })

    it('should orchestrating the unlike action correctly', async () => {
        // Arrange
        const params = {
            commentId: 'comment-123',
            threadId: 'thread-123',
        }

        const owner = 'user-123'

        const expectedResult = {
            status: 'success',
        }

        // mock dependency
        const mockCommentRepository = new CommentRepository()
        const mockLikeRepository = new LikeRepository()

        // mock function
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve())
        mockLikeRepository.verifyLikeComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve(true))
        mockLikeRepository.unlikeComment = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 'success',
            })
        )

        // creating use case instance
        const addLikeUseCase = new AddLikeUseCase({
            likeRepository: mockLikeRepository,
            commentRepository: mockCommentRepository,
        })

        // Action
        const addedLike = await addLikeUseCase.execute(params, owner)

        // Assert
        expect(addedLike).toStrictEqual(expectedResult)
    })
})
