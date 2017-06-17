'use strict';
const ogmneo = require('ogmneo');
const OGMNeoNode = ogmneo.Node;
const UserDTO = require('./DTO/user-dto');
class UserDAO {

    save(user) {
        return new Promise((resolve, reject) => {
            user.registeredAt = new Date();
            OGMNeoNode.create(UserDTO.toNode(user), 'User').then((node) => {
                resolve(UserDTO.fromNode(node));
            }).catch((error) => {
                reject(error);
            });
        });
    }

    update(user) {
        return new Promise((resolve, reject) => {
            OGMNeoNode.update(UserDTO.toNode(user)).then((node) => {
                resolve(UserDTO.fromNode(node));
            }).catch((error) => {
                reject(error);
            });
        });
    }

    delete(user) {
        return new Promise((resolve, reject) => {
            OGMNeoNode.delete(UserDTO.toNode(user)).then((node) => {
                resolve(UserDTO.fromNode(node));
            }).catch((error) => {
                reject(error);
            });
        });
    }

    hasPosts(user) {
        let query = ogmneo.RelationQuery.create('writes').startNode(user.objectId);
        return ogmneo.Relation.exists(query);
    }

    all() {
        return new Promise((resolve, reject) => {
            let query = ogmneo.Query.create('User');
            OGMNeoNode.find(query).then((nodes) => {
                resolve(nodes.map(node => UserDTO.fromNode(node)));
            }).catch((error)=> {
                reject(error);
            });
        });
    }
}

module.exports = UserDAO;