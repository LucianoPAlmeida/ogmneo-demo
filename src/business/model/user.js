'use strict';

const Model = require('./model');

class User extends Model {
    constructor(literal) {
        super(literal);
        if(literal) {
            this.name = literal.name;
            this.registeredAt = literal.registeredAt;
            this.email = literal.email;
        }
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get registeredAt() {
        return this._registeredAt;
    }

    set registeredAt(value) {
        this._registeredAt = value;
    }

    set posts(value) {
        this._posts = value;
    }

    get posts() {
        return this._posts;
    }
}

module.exports = User;