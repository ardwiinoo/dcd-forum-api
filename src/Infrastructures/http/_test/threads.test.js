const pool = require('../../database/postgres/pool')

const createServer = require('../createServer')
const container = require('../../container')

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AuthenticationTestHelper = require('../../../../tests/AuthenticationTestHelper')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
                body: 'sebuah body thread',
            }

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.message).toEqual('Missing authentication')
            expect(responseJson.error).toEqual('Unauthorized')
        })

        it('should response 400 when request not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
            }

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.message).toEqual(
                'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
            )
            expect(responseJson.status).toEqual('fail')
        })

        it('should response 400 when request not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
                body: 123,
            }

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual(
                'tidak dapat membuat thread baru karena tipe data tidak sesuai'
            )
        })

        it('should response 201 when request valid and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'sebuah thread',
                body: 'sebuah body thread',
            }

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedThread).toBeDefined()
            expect(responseJson.data.addedThread.id).toBeDefined()
            expect(responseJson.data.addedThread.owner).toBeDefined()
            expect(responseJson.data.addedThread.title).toBeDefined()
        })
    })

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and return thread correctly', async () => {
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
                threadId: 'thread-123',
                content: 'sebuah comment',
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                commentId: 'comment-123',
                content: 'sebuah reply',
                owner: 'user-123',
            })

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            const {
                data: { thread },
            } = responseJson

            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
            expect(thread.id).toEqual('thread-123')
            expect(thread.title).toEqual('sebuah thread')
            expect(thread.comments).toBeDefined()
            expect(thread.comments[0].replies).toBeDefined()
            expect(typeof responseJson.data).toEqual('object')
            expect(typeof thread).toEqual('object')
        })
    })
})
