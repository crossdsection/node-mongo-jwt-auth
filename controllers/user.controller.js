var User = require('../models/user.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sign up function
exports.createNewUser = async(req, res) => {
    bcrypt.hash(req.body.password, 10, async(err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {

            // try catch block 
            try {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });

                var result = await user.save()
                console.log(result);
                res.status(200).json({
                    success: 'New user has been created'
                });
            } catch (error) {
                res.status(500).json({
                    error: err
                });
            }
        }
    });
}

// Sign in function
exports.signIn = async(req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email }).exec()

        // encrypt user password
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            }
            if (result) {

            	// if user credentials are correct, create a jwt token
                const JWTToken = jwt.sign({
                        email: user.email,
                        _id: user._id
                    },
                    'secret', {
                        expiresIn: '2h'
                    });
                return res.status(200).json({
                    success: 'Let\'s try JWT auth.',
                    token: JWTToken
                });
            }
            return res.status(401).json({
                failed: 'Unauthorized Access'
            });
        });
    } catch (error) {
        res.status(500).json({
            error: error
        });
    };
}