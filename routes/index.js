const userController = require('../controllers/user.controller.js')

module.exports = {
    configure: (app) => {
        app.route('/')
            .get((req, res) => {
                res.json({ status: 200, body: 'Hello' })
            })
        app.route('/get')
            .get((req, res) => {
                res.json({ status: 200, body: 'get' })
            })

        app.route('/signup')
            .post(userController.createNewUser)

        app.route('/signin')
            .post(userController.signIn)

    }
}

