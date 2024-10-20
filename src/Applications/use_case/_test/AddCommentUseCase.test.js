const AddCommentUseCase = require('../AddCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')

describe('AddCommentUseCase', () => {
    it('should orchestrating add comment function correctly', async () => {
        // Arrange
        const payload = {
            content: 'ini komentar',
        }
        const params = {
            threadId: 'thread-123',
        }
        const owner = 'user-123'

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: payload.content,
            owner,
        })

        // creating dependency of use case
        const mockCommentRepository = new CommentRepository()
        const mockThreadRepository = new ThreadRepository()

        // mocking needed function
        mockThreadRepository.validateThreadAvailability = jest
            .fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new AddedComment({
                    id: 'comment-123',
                    content: payload.content,
                    owner,
                })
            )
        )

        // creating use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        })

        // Action
        const addedComment = await addCommentUseCase.execute(
            payload,
            params,
            owner
        )

        // Assert
        expect(mockThreadRepository.validateThreadAvailability).toBeCalledWith(
            params.threadId
        )
        expect(mockCommentRepository.addComment).toBeCalledWith(
            new AddComment({
                content: payload.content,
                owner,
                threadId: params.threadId,
            })
        )
        expect(addedComment).toStrictEqual(expectedAddedComment)
    })
})
