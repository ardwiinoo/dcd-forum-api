const AutheticationTestHelper = {
    async getAccessTokenHelper(server) {
        const responsRegister = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'ardwiinoo',
                password: 'secret_password',
                fullname: 'Arif Dwi Nugroho',
            },
        })

        const responseLogin = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
                username: 'ardwiinoo',
                password: 'secret_password',
            },
        })

        const {
            data: {
                addedUser: { id: userId },
            },
        } = JSON.parse(responsRegister.payload)

        const {
            data: { accessToken },
        } = JSON.parse(responseLogin.payload)

        return { userId, accessToken }
    },
}

module.exports = AutheticationTestHelper
