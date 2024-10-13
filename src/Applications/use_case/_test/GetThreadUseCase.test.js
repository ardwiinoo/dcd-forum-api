const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
    it('should orchestrate the get detail thread action correctly', async () => {
        // Arrange
        const useCasePayload = { threadId: 'thread-123' }
        const expectedThread = {
            id: 'thread-123',
            title: 'ini judul',
            body: 'ini body',
            username: 'ardwiinoo',
            date: '2024-10-12T22:41:00',
            comments: [
                {
                    id: 'comment-123',
                    username: 'dicoding',
                    content: 'ini konten',
                    date: '2024-10-12T22:41:00',
                },
            ],
        }

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        // mocking needed function
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new DetailThread({
                    id: 'thread-123',
                    title: 'ini judul',
                    body: 'ini body',
                    username: 'ardwiinoo',
                    date: '2024-10-12T22:41:00',
                    comments: [],
                })
            )
        )

        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve([
                    {
                        id: 'comment-123',
                        username: 'dicoding',
                        content: 'ini konten',
                        date: '2024-10-12T22:41:00',
                        isDeleted: false,
                    },
                ])
            )

        // creating use case instance
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        })

        // Action
        const thread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(thread).toMatchObject(expectedThread)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(
            useCasePayload.threadId
        )
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
            useCasePayload.threadId
        )
    })

    it('should orchestrating the find thread action correctly, with deleted comment', async () => {
        // Arrange
        const useCasePayload = { threadId: 'thread-123' }
        const expectedThread = {
            id: 'thread-123',
            title: 'ini judul',
            body: 'ini body',
            username: 'ardwiinoo',
            date: '2024-10-12T22:41:00',
            comments: [
                {
                    id: 'comment-123',
                    username: 'dicoding',
                    content: '**komentar telah dihapus**',
                    date: '2024-10-12T22:41:00',
                },
            ],
        }

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        // mocking needed function
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new DetailThread({
                    id: 'thread-123',
                    title: 'ini judul',
                    body: 'ini body',
                    username: 'ardwiinoo',
                    date: '2024-10-12T22:41:00',
                    comments: [],
                })
            )
        )

        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve([
                    {
                        id: 'comment-123',
                        username: 'dicoding',
                        content: '**komentar telah dihapus**',
                        date: '2024-10-12T22:41:00',
                        isDeleted: true,
                    },
                ])
            )

        // creating use case instance
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        })

        // Action
        const thread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(thread).toMatchObject(expectedThread)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(
            useCasePayload.threadId
        )
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
            useCasePayload.threadId
        )
    })
})
