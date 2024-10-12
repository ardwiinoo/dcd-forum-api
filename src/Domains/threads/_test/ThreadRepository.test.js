const ThreadRepository = require('../ThreadRepository')

describe('ThreadRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // arrange
        const threadRepository = new ThreadRepository()

        // action and assert
        await expect(threadRepository.addThread({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        )

        await expect(
            threadRepository.validateThreadById('')
        ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')

        await expect(threadRepository.findThreadById('')).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        )
    })
})
