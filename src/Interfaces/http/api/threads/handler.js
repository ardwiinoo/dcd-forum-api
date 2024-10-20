const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase')

class ThreadsHandler {
    constructor(container) {
        this._container = container

        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
    }

    async postThreadHandler(request, h) {
        const { id: userId } = request.auth.credentials

        const addThreadUseCase = this._container.getInstance(
            AddThreadUseCase.name
        )
        const addedThread = await addThreadUseCase.execute(
            request.payload,
            userId
        )

        return h
            .response({
                status: 'success',
                data: {
                    addedThread,
                },
            })
            .code(201)
    }

    async getThreadByIdHandler(request, h) {
        const getThreadUseCase = this._container.getInstance(
            GetThreadUseCase.name
        )
        const thread = await getThreadUseCase.execute(request.params)

        return h
            .response({
                status: 'success',
                data: { thread },
            })
            .code(200)
    }
}

module.exports = ThreadsHandler
