const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const pool = require('../../database/postgres/pool')

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const AddThread = require('../../../Domains/threads/entities/AddThread')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should persist add new comment correctly', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'ardwiinoo',
                password: 'secret_password',
                fullname: 'Arif Dwi Nugroho',
            })

            const fakeIdGeneratorUser = () => '123'

            const userRepositoryPostgres = new UserRepositoryPostgres(
                pool,
                fakeIdGeneratorUser
            )

            const registeredUser = await userRepositoryPostgres.addUser(
                registerUser
            )

            const newThread = new AddThread({
                title: 'sebuah thread',
                body: 'sebuah body thread',
                owner: registeredUser.id,
            })

            const fakeIdGeneratorThread = () => '123'

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGeneratorThread
            )

            const addedThread = await threadRepositoryPostgres.addThread(
                newThread
            )

            const newComment = new AddComment({
                content: 'sebuah comment',
                owner: registeredUser.id,
                threadId: addedThread.id,
            })

            const fakeIdGeneratorComment = () => '123'

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGeneratorComment
            )

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(
                newComment
            )

            // Assert
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: 'sebuah comment',
                    owner: registeredUser.id,
                })
            )

            const comments = await CommentsTableTestHelper.findCommentById(
                'comment-123'
            )
            expect(comments).toHaveLength(1)
        })
    })

    describe('verifyCommentAvailability function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            expect(() =>
                commentRepositoryPostgres.verifyCommentAvailability({
                    commentId: 'comment-123',
                    threadId: 'thread-123',
                })
            ).rejects.toThrowError(NotFoundError)
        })

        it('should not throw NotFoundError when comment is found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            // Action
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

            // Assert
            await expect(
                commentRepositoryPostgres.verifyCommentAvailability({
                    commentId: 'comment-123',
                    threadId: 'thread-123',
                })
            ).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe('validateCommentOwner function', () => {
        it('should throw AuthorizationError when users can not access comments', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            // Action
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

            // Assert
            expect(() =>
                commentRepositoryPostgres.validateCommentOwner({
                    commentId: 'comment-123',
                    owner: 'user-12',
                })
            ).rejects.toThrowError(AuthorizationError)
        })

        it('should not to throw AuthorizationError when users can access comments', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            // Action
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

            // Assert
            await expect(
                commentRepositoryPostgres.validateCommentOwner({
                    commentId: 'comment-123',
                    owner: 'user-123',
                })
            ).resolves.not.toThrowError(AuthorizationError)
        })
    })

    describe('deleteComment function', () => {
        it('should throw InvariantError when comment does not exist', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            await expect(
                commentRepositoryPostgres.deleteComment('comment-999')
            ).rejects.toThrowError(InvariantError)
        })

        it('should delete comment by id correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'sebuah thread',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'sebuah comment',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            // Action
            await commentRepositoryPostgres.deleteComment('comment-123')

            const comment = await CommentsTableTestHelper.findCommentById(
                'comment-123'
            )

            // Assert
            expect(comment[0].is_deleted).toEqual(true)
        })
    })

    describe('getCommentsByThreadId function', () => {
        it('should return all comment from a thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'sebuah thread',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'sebuah comment',
                threadId: 'thread-123',
                owner: 'user-123',
            })

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            )

            // Action
            const comments =
                await commentRepositoryPostgres.getCommentsByThreadId(
                    'thread-123'
                )

            // Assert
            expect(Array.isArray(comments)).toBe(true)
        })
    })
})
