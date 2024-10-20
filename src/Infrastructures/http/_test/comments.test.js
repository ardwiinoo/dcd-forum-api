const pool = require('../../database/postgres/pool')

const createServer = require('../createServer')
const container = require('../../container')

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AuthenticationTestHelper = require('../../../../tests/AuthenticationTestHelper')

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    })

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah comment',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
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
            const requestPayload = {}

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
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
                'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
            )
        })

        it('should response 400 when request not meet data specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
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
                'tidak dapat membuat comment baru karena tipe data tidak sesuai'
            )
        })

        it('should response 201 when request valid and persisted comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah comment',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedComment).toBeDefined()
            expect(responseJson.data.addedComment.id).toBeDefined()
            expect(responseJson.data.addedComment.content).toBeDefined()
            expect(responseJson.data.addedComment.owner).toBeDefined()
        })
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 401 when request not contain access token', async () => {
            // Arrange
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

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(responseJson.statusCode).toEqual(401)
            expect(responseJson.message).toEqual('Missing authentication')
            expect(responseJson.error).toEqual('Unauthorized')
        })

        it('should response 404 when comment not found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            const server = await createServer(container)

            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('comment tidak ditemukan')
        })

        it('should response 403 when no access to delete the comment', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await UsersTableTestHelper.addUser({
                id: 'user-456',
                username: 'user456',
            })

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-456',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual(
                'anda tidak memiliki akses terhadap comment ini'
            )
        })

        it('should response 200 when delete comment success', async () => {
            // Arrange
            const server = await createServer(container)
            const { accessToken, userId } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                owner: userId,
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                owner: userId,
            })

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/thread-123/comments/comment-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
    })
})
