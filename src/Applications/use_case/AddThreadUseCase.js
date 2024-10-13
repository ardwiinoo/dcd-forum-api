const AddThread = require('../../Domains/threads/entities/AddThread')

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository
    }

    async execute(useCasePayload) {
        const newThread = new AddThread(useCasePayload)
        return await this._threadRepository.addThread(newThread)
    }
}

module.exports = AddThreadUseCase
