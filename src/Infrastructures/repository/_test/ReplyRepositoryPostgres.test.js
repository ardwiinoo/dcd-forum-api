const pool = require('../../database/postgres/pool')

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')

const AddReply = require('../../../Domains/replies/entities/AddReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        pool.end()
    })

    describe('addNewReply function', () => {
        it('should persist add new reply and return added reply correctly', async () => {
            // Arrange
            const fakeIdGeneratorReply = () => '123'

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                fakeIdGeneratorReply
            )

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            const replyPayload = {
                content: 'sebuah reply',
                owner: 'user-123',
                commentId: 'comment-123',
            }

            // Action
            const addedReply = await replyRepositoryPostgres.addReply(
                replyPayload
            )

            // Assert
            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: 'reply-123',
                    content: 'sebuah reply',
                    owner: 'user-123',
                })
            )

            const replies = await RepliesTableTestHelper.findReplyById(
                'reply-123'
            )
            expect(replies).toHaveLength(1)
            expect(replies).toEqual(expect.any(Array))
        })
    })

    describe('getRepliesByThreadId function', () => {
        it('should return all replies by thread id correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'ardwiinoo',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                owner: 'user-123',
                commentId: 'comment-123',
                content: 'sebuah reply',
            })

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action
            const replies = await replyRepositoryPostgres.getRepliesByThreadId(
                'thread-123'
            )

            // Assert
            expect(Array.isArray(replies)).toBe(true)
        })

        it('should return an empty array when there are no replies for the given thread id', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'ardwiinoo',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action
            const replies = await replyRepositoryPostgres.getRepliesByThreadId(
                'thread-123'
            )

            // Assert
            expect(replies).toEqual([])
        })
    })

    describe('verifyReplyAvailability function', () => {
        it('should throw NotFoundError when reply not found', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            expect(() =>
                replyRepositoryPostgres.verifyReplyAvailability({
                    threadId: 'thread-123',
                    commentId: 'comment-123',
                    replyId: 'reply-123',
                })
            ).rejects.toThrowError(NotFoundError)
        })

        it('should not throw NotFoundError when reply is found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                owner: 'user-123',
                commentId: 'comment-123',
                content: 'sebuah reply',
                isDeleted: false,
            })

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            await expect(
                replyRepositoryPostgres.verifyReplyAvailability({
                    threadId: 'thread-123',
                    commentId: 'comment-123',
                    replyId: 'reply-123',
                })
            ).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe('verifyReplyOwner function', () => {
        it('should throw AuthorizationError when users can not access reply', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                owner: 'user-123',
                commentId: 'comment-123',
                content: 'sebuah reply',
            })

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            expect(
                replyRepositoryPostgres.verifyReplyOwner({
                    replyId: 'reply-123',
                    owner: 'user-999',
                })
            ).rejects.toThrowError(AuthorizationError)
        })

        it('should not throw AuthorizationError when users can access reply', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                owner: 'user-123',
                commentId: 'comment-123',
                content: 'sebuah reply',
            })

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            await expect(
                replyRepositoryPostgres.verifyReplyOwner({
                    replyId: 'reply-123',
                    owner: 'user-123',
                })
            ).resolves.not.toThrowError(AuthorizationError)
        })
    })

    describe('deleteReplyById function', () => {
        it('should delete the reply by comment id correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                owner: 'user-123',
                commentId: 'comment-123',
                content: 'sebuah reply',
            })

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            )

            // Action
            await replyRepositoryPostgres.deleteReplyById('reply-123')

            // Assert
            const reply = await RepliesTableTestHelper.findReplyById(
                'reply-123'
            )

            expect(reply[0].is_deleted).toBe(true)
        })
    })
})
