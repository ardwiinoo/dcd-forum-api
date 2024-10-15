class GetThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute(useCaseParams) {
        const { threadId } = useCaseParams

        const thread = await this._threadRepository.getThreadById(threadId)

        const comments = await this._commentRepository.getCommentsByThreadId(
            threadId
        )

        thread.comments = comments

        return thread
    }
}

module.exports = GetThreadUseCase
