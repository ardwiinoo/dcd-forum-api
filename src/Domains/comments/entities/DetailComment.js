class DetailComment {
    constructor(payload) {
        this._verifyPayload(payload)

        const { id, username, date, content, isDeleted } = payload

        this.id = id
        this.username = username
        this.date = date
        this.content = isDeleted ? '**komentar telah dihapus**' : content
    }

    _verifyPayload({ id, username, date, content, isDeleted }) {
        if (
            !id ||
            !username ||
            !date ||
            !content ||
            isDeleted === 'undefined'
        ) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (
            typeof id !== 'string' ||
            typeof username !== 'string' ||
            typeof content !== 'string' ||
            typeof isDeleted !== 'boolean' ||
            typeof date !== 'string'
        ) {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
    }
}

module.exports = DetailComment
