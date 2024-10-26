const AddLike = require('../AddLike')

describe('a AddLike entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
        }

        // Action and Assert
        expect(() => new AddLike(payload)).toThrowError(
            'ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: 123,
            userId: true,
        }

        // Action and Assert
        expect(() => new AddLike(payload)).toThrowError(
            'ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })

    it('should create AddLike object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
            userId: 'user-123',
        }

        // Action
        const newLike = new AddLike(payload)

        // Assert
        expect(newLike.commentId).toEqual(payload.commentId)
        expect(newLike.userId).toEqual(payload.userId)
    })
})
