const GetThreadUseCase = require('../GetThreadUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')

describe('GetThreadUseCase', () => {
    it('should orchestrating get detail thread action correctly', async () => {
        // Arrange
        const params = { threadId: 'thread-123' }

        const thread = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'sebuah body',
            username: 'dicoding',
            date: new Date().toISOString(),
        }

        const comments = [
            new DetailComment({
                id: 'comment-123',
                username: 'dicoding',
                date: new Date().toISOString(),
                content: 'sebuah komentar',
                isDeleted: false,
            }),
        ]

        const expectedThread = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'sebuah body',
            username: 'dicoding',
            date: new Date().toISOString(),
            comments,
        }

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        // mocking needed function
        mockThreadRepository.getThreadById = jest
            .fn()
            .mockImplementation(() => Promise.resolve(thread))
        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() => Promise.resolve(comments))

        // creating use case instance
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        })

        // Action
        const threadDetail = await getThreadUseCase.execute(params)

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(
            params.threadId
        )
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
            params.threadId
        )
        expect(threadDetail).toStrictEqual(expectedThread)
    })
})
