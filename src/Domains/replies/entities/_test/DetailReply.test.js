const DetailReply = require('../DetailReply')

describe('DetailReply', () => {
    it('should throw error when payload does not contain needed property', () => {
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan',
            username: 'user123',
        }

        expect(() => new DetailReply(payload)).toThrowError(
            'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })

    it('should throw error when payload does not meet data type specification', () => {
        const payload = {
            id: 'reply-123',
            content: {},
            date: [],
            username: 'dicoding',
            commentId: 'comment-123',
            isDeleted: 'yes',
        }

        expect(() => new DetailReply(payload)).toThrowError(
            'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })

    it('should create DetailReply object correctly when isDeleted is false', () => {
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan',
            date: '2023-10-01',
            username: 'user123',
            commentId: 'comment-123',
            isDeleted: false,
        }

        const detailReply = new DetailReply(payload)

        expect(detailReply.id).toEqual(payload.id)
        expect(detailReply.content).toEqual(payload.content)
        expect(detailReply.date).toEqual(payload.date)
        expect(detailReply.username).toEqual(payload.username)
        expect(detailReply.commentId).toEqual(payload.commentId)
    })

    it('should create DetailReply object correctly when isDeleted is true', () => {
        const payload = {
            id: 'reply-123',
            content: 'sebuah balasan',
            date: '2023-10-01',
            username: 'user123',
            commentId: 'comment-123',
            isDeleted: true,
        }

        const detailReply = new DetailReply(payload)

        expect(detailReply.id).toEqual(payload.id)
        expect(detailReply.content).toEqual('**balasan telah dihapus**')
        expect(detailReply.date).toEqual(payload.date)
        expect(detailReply.username).toEqual(payload.username)
        expect(detailReply.commentId).toEqual(payload.commentId)
    })
})
