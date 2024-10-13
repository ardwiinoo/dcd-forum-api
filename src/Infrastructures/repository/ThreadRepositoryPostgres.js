const DetailThread = require('../../Domains/threads/entities/DetailThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/threads/entities/AddedThread')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(newThread) {
        const { title, body, owner } = newThread
        const id = `thread-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner, date',
            values: [id, title, body, owner],
        }

        const { rows } = await this._pool.query(query)

        return new AddedThread({ ...rows[0] })
    }

    async validateThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        }

        const { rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('Thread tidak ditemukan')
        }
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t JOIN users u ON u.id = t.owner WHERE t.id = $1',
            values: [threadId],
        }

        const { rows, rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('Thread tidak ditemukan')
        }

        return new DetailThread({
            ...rows[0],
            date: rows[0].date.toISOString(),
            comments: [],
        })
    }
}

module.exports = ThreadRepositoryPostgres
