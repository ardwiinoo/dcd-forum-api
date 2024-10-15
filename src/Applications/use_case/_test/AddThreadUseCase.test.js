const AddThreadUseCase = require('../AddThreadUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

describe('AddThreadUseCase', () => {
    it('should orchestrating add thread function correctly', async () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'ini judul',
            body: 'ini body',
        }

        const owner = 'user-123'

        const expectedAddedThread = new AddedThread({
            id: payload.id,
            title: payload.title,
            owner: owner,
        })

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()

        // mocking needed function
        mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new AddedThread({
                    id: payload.id,
                    title: payload.title,
                    owner: owner,
                })
            )
        )

        // creating use case instance
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        })

        // Action
        const addedThread = await addThreadUseCase.execute(payload, owner)

        // Assert
        expect(mockThreadRepository.addThread).toBeCalledWith(
            new AddThread({
                title: payload.title,
                body: payload.body,
                owner,
            })
        )
        expect(addedThread).toStrictEqual(expectedAddedThread)
    })
})
