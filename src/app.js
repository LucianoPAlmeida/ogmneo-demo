'use strict';

let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let UserResource = require('./resources/v1/user');
let app = express();
const UserGraph = require('./resources/v1/graphql/users-graphql');

//Connection
const ogmneo = require('ogmneo');
ogmneo.Connection.connect(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD, process.env.NEO4J_HOST);



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//REST
let v1 = express.Router();
v1.use('/users', new UserResource().router);

app.use('/v1', v1);

//GRAPHQL
v1.use('/users-query', new UserGraph().route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
