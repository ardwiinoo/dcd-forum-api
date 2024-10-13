const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableHelper')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist new thread', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-999',
                username: 'ardwiinoo',
            })
            const newThread = new AddThread({
                title: 'ini judul',
                body: 'ini body',
                owner: 'user-999',
            })

            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action
            await threadRepositoryPostgres.addThread(newThread)

            // Assert
            const threads = await ThreadsTableTestHelper.getThreadById(
                'thread-123'
            )
            expect(threads).toHaveLength(1)
        })

        it('should return new thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'ardwiinoo',
            })
            const newThread = new AddThread({
                title: 'ini judul',
                body: 'ini body',
                owner: 'user-123',
            })
            const expectedResult = new AddedThread({
                id: 'thread-123',
                title: 'ini judul',
                owner: 'user-123',
            })
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            )

            // Action
            const result = await threadRepositoryPostgres.addThread(newThread)

            // Assert
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('validateThreadById function', () => {
        it('should throw NotFoundError when thread not available', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-124',
                username: 'ardwiinoo',
            })
            await ThreadsTableTestHelper.addThread({
                id: 'thread-124',
                title: 'sebuah thread',
                owner: 'user-124',
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                () => {}
            )

            // Action and Assert
            await expect(
                threadRepositoryPostgres.validateThreadById('xxx')
            ).rejects.toThrowError(NotFoundError)
        })
    })

    describe('getThreadById function', () => {
        it('should return thread correctly', async () => {})

        it('should throw NotFoundError when thread does not exist', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            await expect(
                threadRepositoryPostgres.getThreadById('thread-xyz')
            ).rejects.toThrowError(NotFoundError)
        })
    })
})
