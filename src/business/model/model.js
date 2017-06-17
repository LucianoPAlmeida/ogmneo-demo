'use strict';

const _ = require('lodash');

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

    asObject() {
        let obj = {};
        _.keys(this).forEach((key) => {
            if (_.startsWith(key, '_')) {
                let newKey = _.trimStart(key,'_');
                let value = this[newKey];
                obj[newKey] = value;
                if (value && _.isFunction(value.asObject)) {
                    obj[newKey] = value.asObject();
                } else if (_.isDate(value)) {
                    obj[newKey] = value.toISOString();
                }
            }
        });
        return obj;
    }
}

module.exports = Model;