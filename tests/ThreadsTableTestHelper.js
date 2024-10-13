/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123',
        title = 'ini sebuah thread',
        body = 'ini body thread',
        owner = 'user-123',
        date = '2024-10-13T01:57:00',
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, date],
        }

        await pool.query(query)
    },

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        }

        const { rows } = await pool.query(query)
        return rows
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE threads CASCADE')
    },
}

module.exports = ThreadsTableTestHelper
