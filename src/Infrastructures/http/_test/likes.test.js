const pool = require('../../database/postgres/pool')

const createServer = require('../createServer')
const container = require('../../container')

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AuthenticationTestHelper = require('../../../../tests/AuthenticationTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    })

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
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
                owner: 'user-123',
                threadId: 'thread-123',
            })

            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/thread-123/comments/comment-123/likes`,
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.message).toEqual('Missing authentication')
            expect(responseJson.error).toEqual('Unauthorized')
        })

        it('should response 404 when comment not found', async () => {
            // Arrange
            const commentId = 'comment-123'

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
                method: 'PUT',
                url: `/threads/thread-123/comments/${commentId}/likes`,
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

        it('should response 200 when user likes a comment', async () => {
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
                content: 'sebuah comment',
            })

            const server = await createServer(container)
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/thread-123/comments/comment-123/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })

        it('should response 200 when user unlikes a previously liked comment', async () => {
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
            const { accessToken } =
                await AuthenticationTestHelper.getAccessTokenHelper(server)

            // Precondition
            await server.inject({
                method: 'PUT',
                url: `/threads/thread-123/comments/comment-123/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Action
            const unlikeResponse = await server.inject({
                method: 'PUT',
                url: `/threads/thread-123/comments/comment-123/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // Assert
            const unlikeResponseJson = JSON.parse(unlikeResponse.payload)
            expect(unlikeResponse.statusCode).toEqual(200)
            expect(unlikeResponseJson.status).toEqual('success')
        })
    })
})
