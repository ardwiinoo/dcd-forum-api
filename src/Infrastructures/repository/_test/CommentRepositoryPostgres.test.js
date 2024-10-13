const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should persist new comment and return added comment correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'ardwiinoo',
            })
            await ThreadsTableTestHelper.addThread({
                id: 'thread-777',
                title: 'sebuah thread',
            })
            const newComment = new AddComment({
                content: 'a comment',
                owner: 'user-123',
                threadId: 'thread-777',
            })
            const fakeIdGenerator = () => '888'
            const commentRepository = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action
            await commentRepository.addComment(newComment)

            // Assert
            const comments = await CommentsTableTestHelper.getCommentById(
                'comment-888'
            )
            expect(comments).toHaveLength(1)
        })

        it('should return added comment correctly', async () => {
            // arrange
            await UsersTableTestHelper.addUser({ username: 'ardwiinoo' })
            await ThreadsTableTestHelper.addThread({
                id: 'thread-999',
                title: 'sebuah thread',
            })
            const newComment = new AddComment({
                content: 'ini konten',
                owner: 'user-123',
                threadId: 'thread-999',
            })
            const expectedResult = new AddedComment({
                id: 'comment-123',
                content: 'ini konten',
                owner: 'user-123',
            })
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // action
            const addedComment = await commentRepositoryPostgres.addComment(
                newComment
            )

            // assert
            expect(addedComment).toStrictEqual(expectedResult)
        })
    })
})
