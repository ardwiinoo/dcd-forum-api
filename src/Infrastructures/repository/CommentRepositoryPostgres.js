const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const InvariantError = require('../../Commons/exceptions/InvariantError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const DetailComment = require('../../Domains/comments/entities/DetailComment')

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(newComment) {
        const { content, owner, threadId } = newComment
        const id = `comment-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, threadId],
        }

        const { rows } = await this._pool.query(query)

        return new AddedComment({
            ...rows[0],
        })
    }

    async verifyCommentAvailability({ commentId, threadId }) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2 AND is_deleted = FALSE',
            values: [commentId, threadId],
        }

        const { rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('comment tidak ditemukan')
        }
    }

    async validateCommentOwner({ commentId, owner }) {
        const query = {
            text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, owner],
        }

        const { rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new AuthorizationError(
                'anda tidak memiliki akses terhadap comment ini'
            )
        }
    }

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
            values: [commentId],
        }

        const { rowCount } = await this._pool.query(query)

        if (!rowCount) {
            throw new InvariantError('gagal menghapus comment')
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `
            SELECT c.id, 
                   u.username, 
                   c.date, 
                   c.content, 
                   c.is_deleted
            FROM comments AS c
            INNER JOIN users AS u ON c.owner = u.id
            WHERE c.thread_id = $1 
            ORDER BY c.date ASC
        `,
            values: [threadId],
        }

        const { rows } = await this._pool.query(query)

        return rows.map((row) => {
            return new DetailComment({
                id: row.id,
                username: row.username,
                date: new Date(row.date).toISOString(),
                content: row.content,
                isDeleted: row.is_deleted,
            })
        })
    }
}

module.exports = CommentRepositoryPostgres
