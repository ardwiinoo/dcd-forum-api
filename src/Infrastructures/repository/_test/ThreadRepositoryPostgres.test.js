const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

const pool = require('../../database/postgres/pool')

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')

const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')

const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgress', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist add new thread correctly', async () => {
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

            // Action
            await threadRepositoryPostgres.addThread(newThread)

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById(
                'thread-123'
            )
            expect(threads).toHaveLength(1)
        })

        it('should return added thread correctly', async () => {
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

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(
                newThread
            )

            // Assert
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: 'thread-123',
                    title: 'sebuah thread',
                    owner: registeredUser.id,
                })
            )
        })
    })

    describe('validateThreadAvailability function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            )

            expect(() =>
                threadRepositoryPostgres.validateThreadAvailability(
                    'thread-123'
                )
            ).rejects.toThrowError(NotFoundError)
        })

        it('should not throw NotFoundError when thread is found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' })
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            await expect(
                threadRepositoryPostgres.validateThreadAvailability(
                    'thread-123'
                )
            ).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe('getThreadById function', () => {
        it('should return NotFoundError when thread is not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            )

            // Action and Assert
            expect(() =>
                threadRepositoryPostgres.getThreadById('thread-123')
            ).rejects.toThrowError(NotFoundError)
        })

        it('should return thread correctly', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            )

            const userPayload = {
                id: 'user-123',
                username: 'ardwiinoo',
            }

            await UsersTableTestHelper.addUser(userPayload)

            const threadPayload = {
                id: 'thread-123',
                title: 'sebuah thread',
                body: 'sebuah body thread',
                owner: userPayload.id,
            }

            await ThreadsTableTestHelper.addThread(threadPayload)

            // Action
            const thread = await threadRepositoryPostgres.getThreadById(
                threadPayload.id
            )

            // Assert
            expect(thread.id).toEqual(threadPayload.id)
            expect(thread.title).toEqual(threadPayload.title)
            expect(thread.body).toEqual(threadPayload.body)
            expect(thread.username).toEqual(userPayload.username)
        })
    })
})
