const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'ini konten',
            owner: 'user-123',
            threadId: 'thread-123',
        }

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        })

        // creating dependency of use case
        const mockCommentRepository = new CommentRepository()
        const mockThreadRepository = new ThreadRepository()

        // mocking needed function
        mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new AddedComment({
                    id: 'comment-123',
                    content: useCasePayload.content,
                    owner: useCasePayload.owner,
                })
            )
        )

        mockThreadRepository.validateThreadById = jest
            .fn()
            .mockImplementation(() => Promise.resolve())

        // creating use case instance
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        })

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockCommentRepository.addComment).toBeCalledWith(
            new AddComment({
                content: useCasePayload.content,
                owner: useCasePayload.owner,
                threadId: useCasePayload.threadId,
            })
        )
        expect(addedComment).toStrictEqual(expectedAddedComment)
        expect(mockThreadRepository.validateThreadById).toBeCalledWith(
            useCasePayload.threadId
        )
    })
})