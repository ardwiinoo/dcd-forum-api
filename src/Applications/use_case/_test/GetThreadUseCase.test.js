const GetThreadUseCase = require('../GetThreadUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')

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
            new DetailComment({
                id: 'comment-124',
                username: 'dicoding',
                date: new Date().toISOString(),
                content: 'sebuah komentar',
                isDeleted: true,
            }),
        ]

        const replies = [
            new DetailReply({
                id: 'reply-123',
                content: 'sebuah balasan',
                date: new Date().toISOString(),
                username: 'dicoding',
                commentId: 'comment-124',
                isDeleted: false,
            }),
            new DetailReply({
                id: 'reply-124',
                content: 'sebuah balasan',
                date: new Date().toISOString(),
                username: 'dicoding',
                commentId: 'comment-123',
                isDeleted: true,
            }),
        ]

        const expectedThread = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'sebuah body',
            username: 'dicoding',
            date: thread.date,
            comments: [
                {
                    id: 'comment-123',
                    content: 'sebuah komentar',
                    date: comments[0].date,
                    username: 'dicoding',
                    replies: [
                        {
                            id: 'reply-124',
                            content: '**balasan telah dihapus**',
                            date: replies[1].date,
                            username: 'dicoding',
                        },
                    ],
                    likeCount: 0,
                },
                {
                    id: 'comment-124',
                    content: '**komentar telah dihapus**',
                    date: comments[1].date,
                    username: 'dicoding',
                    replies: [
                        {
                            content: 'sebuah balasan',
                            date: replies[0].date,
                            id: 'reply-123',
                            username: 'dicoding',
                        },
                    ],
                    likeCount: 0,
                },
            ],
        }

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()
        const mockLikeRepository = new LikeRepository()

        // mocking needed function
        mockThreadRepository.getThreadById = jest
            .fn()
            .mockImplementation(() => Promise.resolve(thread))
        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() => Promise.resolve(comments))
        mockReplyRepository.getRepliesByThreadId = jest
            .fn()
            .mockImplementation(() => Promise.resolve(replies))
        mockLikeRepository.getLikeCountByCommentId = jest
            .fn()
            .mockImplementation(() => Promise.resolve(0))

        // creating use case instance
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository,
        })

        // Action
        const detailThread = await getThreadUseCase.execute(params)

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(
            params.threadId
        )
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
            params.threadId
        )
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
            params.threadId
        )
        expect(
            mockLikeRepository.getLikeCountByCommentId
        ).toHaveBeenCalledTimes(comments.length)
        expect(detailThread).toEqual(expectedThread)
    })
})
