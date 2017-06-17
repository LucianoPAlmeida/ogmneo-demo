'use strict';

const User = require('../../model/user');

class UserDTO {
    constructor() {}

    static fromNode(node) {
        if (node) {
            return new User({
                objectId: node.id,
                name: node.name,
                email: node.email,
                registeredAt: new Date(node.registeredAt)
            });
        }
        return null;
    }

    static toNode(user) {
        if( user) {
            return {
                id: user.objectId,
                name: user.name,
                email: user.email,
                registeredAt: user.registeredAt
            };
        }
        return null;
    }
}

module.exports = UserDTO;