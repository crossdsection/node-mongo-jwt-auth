(async() => {
    const express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose');
    require('dotenv').config()

    // function to handle database connection
    const connect = async(mongoUri, promiseLib) => {
        promiseLib = promiseLib || global.Promise;

        mongoose.Promise = promiseLib;
        const mongoDB = mongoose.connect(mongoUri, {
            promiseLibrary: promiseLib // Deprecation issue again
        });
        var db;
        try {
            db = await mongoDB
            console.log('Connected to db')
        } catch (err) {
            console.log('Error while trying to connect with mongodb');
        }
        // Even though it's a promise, no need to worry about creating models immediately,
        // as mongoose buffers requests until a connection is made

        return db;
    }

    // connect to database
    const _db = await connect(process.env.DB_URL)

    // parse incoming requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // include routes
    const routes = require('./routes/index');
    routes.configure(app)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error('File Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    // define as the last app.use callback
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err.message);
    });

    let port = process.env.PORT

    // listen on port
    app.listen(port, function() {
        console.log('Server address: http://localhost:' + port);
    });

})()