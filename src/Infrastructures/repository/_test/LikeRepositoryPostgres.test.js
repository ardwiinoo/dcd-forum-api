const pool = require('../../database/postgres/pool')

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const AddLike = require('../../../Domains/likes/entities/AddLike')

const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')

describe('LikeRepositoryPostgres', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    describe('likeComment function', () => {
        it('should persist add like', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread: 'thread-123',
                owner: 'user-123',
            })

            const newLike = new AddLike({
                commentId: 'comment-123',
                owner: 'user-123',
            })

            const fakeIdGenerator = () => '123'
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action
            await likeRepositoryPostgres.likeComment(newLike)

            // Assert
            const like = await LikesTableTestHelper.findLikeById('like-123')
            expect(like).toHaveLength(1)
            expect(like[0].id).toEqual('like-123')
            expect(like[0].comment_id).toEqual('comment-123')
            expect(like[0].owner).toEqual('user-123')
        })
    })

    describe('unlikeComment function', () => {
        it('should persist unlike', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread: 'thread-123',
                owner: 'user-123',
            })

            await LikesTableTestHelper.likeComment({
                id: 'like-123',
                comment_id: 'comment-123',
                owner: 'user-123',
            })

            const newLike = new AddLike({
                commentId: 'comment-123',
                owner: 'user-123',
            })

            const fakeIdGenerator = () => '123'

            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action
            await likeRepositoryPostgres.unlikeComment(newLike)

            // Assert
            const like = await LikesTableTestHelper.findLikeById('like-123')
            expect(like).toHaveLength(0)
            expect(like[0]).toBeUndefined()
        })
    })

    describe('verifyLikeComment function', () => {
        it('should return true if like exists', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread: 'thread-123',
                owner: 'user-123',
            })

            await LikesTableTestHelper.likeComment({
                id: 'like-123',
                comment_id: 'comment-123',
                owner: 'user-123',
            })

            const newLike = new AddLike({
                commentId: 'comment-123',
                owner: 'user-123',
            })

            const fakeIdGenerator = () => '123'

            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action and Assert
            await expect(
                likeRepositoryPostgres.verifyLikeComment(newLike)
            ).resolves.toEqual(true)
        })

        it('should return false if like not exists', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread: 'thread-123',
                owner: 'user-123',
            })

            const newLike = new AddLike({
                commentId: 'comment-123',
                owner: 'user-123',
            })

            const fakeIdGenerator = () => '123'

            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action and Assert
            await expect(
                likeRepositoryPostgres.verifyLikeComment(newLike)
            ).resolves.toEqual(false)
        })
    })

    describe('getLikeCountByCommentId function', () => {
        it('should return like count by comment id', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread: 'thread-123',
                owner: 'user-123',
            })

            await LikesTableTestHelper.likeComment({
                id: 'like-123',
                comment_id: 'comment-123',
                owner: 'user-123',
            })

            const fakeIdGenerator = () => '123'

            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action and Assert
            await expect(
                likeRepositoryPostgres.getLikeCountByCommentId('comment-123')
            ).resolves.toEqual(1)
        })
    })
})
