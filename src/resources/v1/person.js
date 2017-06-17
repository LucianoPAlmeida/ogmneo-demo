'use strict';
const express = require('express');


class UserResource {

    constructor() {
        this._router = express.Router();
        this._setup();
    }

    _setup() {
        this._setupResource();
    }

    get router() {
        return this._router;
    }

    _setupResource() {
        this.router.get('/', (req, res ) => {
            res.send({ message : 'This is an awsome template for ES6/Node.js' });
        });
    }


}
module.exports = IndexResource;
