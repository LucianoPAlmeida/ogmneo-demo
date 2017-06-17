'use strict';

const Model = require('./model');

class User extends Model {
    constructor(literal) {
        super(literal);
        if(literal) {
            this.text = literal.text;
            this.date = literal.date;
        }
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }
}

module.exports = UserDTO;