const pool = require('../../database/postgres/pool')

const createServer = require('../createServer')
const container = require('../../container')

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AuthenticationTestHelper = require('../../../../tests/AuthenticationTestHelper')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    })

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah reply',
            }

            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: 'user-123',
            })

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies`,
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

            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.message).toEqual(
                'tidak dapat membuat reply comment baru karena properti yang dibutuhkan tidak ada'
            )
            expect(responseJson.status).toEqual('fail')
        })

        it('should response 400 when request not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            }

            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.message).toEqual(
                'tidak dapat membuat reply comment baru karena tipe data tidak sesuai'
            )
            expect(responseJson.status).toEqual('fail')
        })

        it('should response 201 when request valid and persisted reply comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'sebuah reply',
            }

            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            const {
                data: { addedReply },
            } = responseJson
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(addedReply.content).toBeDefined()
            expect(addedReply.owner).toBeDefined()
            expect(addedReply.id).toBeDefined()
            expect(typeof responseJson.data).toBe('object')
            expect(typeof addedReply).toBe('object')
        })
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                replyId: 'reply-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: 'user-123',
            })

            await RepliesTableTestHelper.addReply({
                id: requestParams.replyId,
                commentId: requestParams.commentId,
                owner: 'user-123',
            })

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies/${requestParams.replyId}`,
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.message).toEqual('Missing authentication')
            expect(responseJson.error).toEqual('Unauthorized')
        })

        it('should response 404 when reply not found', async () => {
            // Arrange
            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                replyId: 'reply-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-123',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: 'user-123',
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: 'user-123',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies/${requestParams.replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toBeDefined()
        })

        it('should response 403 when reply not owned by user', async () => {
            // Arrange
            const server = await createServer(container)
            const { accessToken, userId } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)
            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                replyId: 'reply-123',
            }

            await UsersTableTestHelper.addUser({
                id: 'user-456',
                username: 'user456',
            })

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: userId,
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: userId,
            })

            await RepliesTableTestHelper.addReply({
                id: requestParams.replyId,
                commentId: requestParams.commentId,
                owner: 'user-456',
            })

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies/${requestParams.replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toBeDefined()
        })

        it('should response 200 when reply deleted successfully', async () => {
            // Arrange
            const server = await createServer(container)
            const { accessToken, userId } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)
            const requestParams = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                replyId: 'reply-123',
            }

            await ThreadsTableTestHelper.addThread({
                id: requestParams.threadId,
                owner: userId,
            })

            await CommentsTableTestHelper.addComment({
                id: requestParams.commentId,
                threadId: requestParams.threadId,
                owner: userId,
            })

            await RepliesTableTestHelper.addReply({
                id: requestParams.replyId,
                commentId: requestParams.commentId,
                owner: userId,
            })

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${requestParams.threadId}/comments/${requestParams.commentId}/replies/${requestParams.replyId}`,
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
