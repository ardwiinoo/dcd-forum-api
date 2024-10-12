const DetailThread = require('../DetailThread')

describe('a DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // arrange
        const payload = {
            id: 'thread-123',
            title: 'ini judul',
            body: 'ini body',
            date: 'ini date',
            comments: [],
        }

        // action and assert
        expect(() => new DetailThread(payload)).toThrowError(
            'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })

    it('should throw error when payload did not meet data type specification', () => {
        // arrange
        const payload = {
            id: true,
            title: ['ini judul'],
            body: 999,
            date: {},
            username: [true, false],
            comments: 'Example Comments',
        }

        // action and assert
        expect(() => new DetailThread(payload)).toThrowError(
            'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })

    it('should create detailThread object correctly', () => {
        // arrange
        const payload = {
            id: 'thread-123',
            title: 'ini judul',
            body: 'ini body',
            date: 'ini date',
            username: 'user-123',
            comments: [],
        }

        // action
        const { id, title, body, date, username, comments } = new DetailThread(
            payload
        )

        // assert
        expect(id).toEqual(payload.id)
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(date).toEqual(payload.date)
        expect(username).toEqual(payload.username)
        expect(comments).toEqual(payload.comments)
    })
})
