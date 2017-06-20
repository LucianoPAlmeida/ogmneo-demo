'use strict';
const ogmneo = require('ogmneo');
const OGMNeoNode = ogmneo.Node;
const UserDTO = require('./DTO/user-dto');
const PostDAO = require('./post-dao');

class UserDAO {

    constructor() {
        this._postDAO = new PostDAO();
    }

    get postDAO() {
        return this._postDAO;
    }

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
            }).catch((error) => {
                reject(error);
            });
        });
    }

    allPopulated() {
        return new Promise((resolve, reject) => {
            let query = ogmneo.Query.create('User');
            OGMNeoNode.find(query).then((nodes) => {
                let users = nodes.map(node => UserDTO.fromNode(node));
                let postPromises = users.map(user => this.postDAO.postsForUser(user));
                Promise.all(postPromises).then((results) => {
                    console.log(results);
                    users.forEach((user, idx) => {
                        user.posts = results[idx];
                    });
                    resolve(users);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
}

module.exports = UserDAO;