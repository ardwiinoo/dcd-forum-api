const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
    it('should throw error when payload does not contain needed property', () => {
        const payload = {
            id: 'comment-123',
            date: new Date('2024-10-12T22:41:00'),
            content: 'ini komentar',
        }

        expect(() => new DetailComment(payload)).toThrowError(
            'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })

    it('should throw error when payload does not meet data type specification', () => {
        const payload = {
            id: 123,
            username: 'user-123',
            date: new Date('2024-10-12T22:41:00'),
            content: 'ini komentar',
            isDeleted: 'false',
        }

        expect(() => new DetailComment(payload)).toThrowError(
            'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })

    it('should create DetailComment object correctly when isDeleted is false', () => {
        const payload = {
            id: 'comment-123',
            username: 'user-123',
            date: new Date().toISOString(),
            content: 'ini komentar',
            isDeleted: false,
        }

        const detailComment = new DetailComment(payload)

        expect(detailComment.id).toEqual(payload.id)
        expect(detailComment.username).toEqual(payload.username)
        expect(detailComment.date).toEqual(payload.date)
        expect(detailComment.content).toEqual(payload.content)
    })

    it('should create DetailComment object correctly when isDeleted is true', () => {
        const payload = {
            id: 'comment-123',
            username: 'user-123',
            date: new Date().toISOString(),
            content: 'ini komentar',
            isDeleted: true,
        }

        const detailComment = new DetailComment(payload)

        expect(detailComment.id).toEqual(payload.id)
        expect(detailComment.username).toEqual(payload.username)
        expect(detailComment.date).toEqual(payload.date)
        expect(detailComment.content).toEqual('**komentar telah dihapus**')
    })
})
