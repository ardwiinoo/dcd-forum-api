const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async likeComment(newLike) {
        const { commentId, owner } = newLike
        const id = `like-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO likes (id, comment_id, owner) VALUES ($1, $2, $3) RETURNING id',
            values: [id, commentId, owner],
        }

        await this._pool.query(query)
    }

    async unlikeComment(newLike) {
        const { commentId, owner } = newLike

        const query = {
            text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        }

        await this._pool.query(query)
    }

    async verifyLikeComment(newLike) {
        const { commentId, owner } = newLike

        const query = {
            text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        }

        const { rowCount } = await this._pool.query(query)

        return rowCount > 0
    }

    async getLikeCountByCommentId(commentId) {
        const query = {
            text: 'SELECT COUNT(id) FROM likes WHERE comment_id = $1',
            values: [commentId],
        }

        const { rows } = await this._pool.query(query)

        return Number(rows[0].count)
    }
}

module.exports = LikeRepositoryPostgres
