const AddThreadUseCase = require('../AddThreadUseCase')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'thread-123',
            title: 'ini judul',
            body: 'ini body',
            owner: 'user-123',
        }

        const expectedAddedThread = new AddedThread({
            id: useCasePayload.id,
            title: useCasePayload.title,
            owner: useCasePayload.owner,
        })

        // creating dependency of use case
        const mockThreadRepository = new ThreadRepository()

        // mocking needed function
        mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
            Promise.resolve(
                new AddedThread({
                    id: useCasePayload.id,
                    title: useCasePayload.title,
                    owner: useCasePayload.owner,
                })
            )
        )

        // create use case instance
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        })

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload)

        expect(mockThreadRepository.addThread).toBeCalledWith(
            new AddThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
                owner: useCasePayload.owner,
            })
        )

        expect(addedThread).toStrictEqual(expectedAddedThread)
    })
})
