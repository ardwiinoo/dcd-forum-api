/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123',
        content = 'ini konten komentar',
        owner = 'user-123',
        threadId = 'thread-123',
        date = '2024-10-13T08:57:00',
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
            values: [id, content, owner, threadId, date],
        }

        await pool.query(query)
    },

    async getCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        }

        const { rows } = await pool.query(query)
        return rows
    },

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
            values: [commentId],
        }

        await pool.query(query)
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments CASCADE')
    },
}

module.exports = CommentsTableTestHelper
