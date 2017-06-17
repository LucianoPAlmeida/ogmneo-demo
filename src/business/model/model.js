'use strict';

class Model {
    constructor(literal) {
        if(literal) {
            this.objectId = literal.objectId;
        }
    }

    get objectId() {
        return this._objectId;
    }

    set objectId(value) {
        this._objectId = value;
    }
}

module.exports = UserDTO;