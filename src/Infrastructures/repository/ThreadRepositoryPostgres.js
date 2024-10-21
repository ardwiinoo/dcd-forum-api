const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const DetailThread = require('../../Domains/threads/entities/DetailThread')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(newThread) {
        const { title, body, owner } = newThread
        const date = new Date().toISOString()
        const id = `thread-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO threads (id, title, body, owner, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, date],
        }

        const { rows } = await this._pool.query(query)

        return new AddedThread({
            ...rows[0],
        })
    }

    async validateThreadAvailability(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        }

        const { rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }
    }

    async getThreadById(threadId) {
        const query = {
            text: `SELECT t.id, t.title, t.body, t.date, u.username 
            FROM threads AS t INNER JOIN users AS u 
            ON t.owner=u.id WHERE t.id = $1`,
            values: [threadId],
        }

        const { rows, rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('thread tidak ditemukan')
        }

        return new DetailThread({
            ...rows[0],
            date: rows[0].date.toISOString(),
            comments: [],
        })
    }
}

module.exports = ThreadRepositoryPostgres
