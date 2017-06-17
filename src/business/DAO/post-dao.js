'use strict';

const ogmneo = require('ogmneo');

const PostDTO = require('./DTO/post-dto');

class PostDAO {

    saveForUser(post, user) {
        return new Promise((resolve, reject) => {
            post.date = new Date();
            ogmneo.Node.create(PostDTO.toNode(post), 'Post').then((created) => {
                ogmneo.Relation.relate(user.objectId, 'writes', created.id).then(() => {
                    resolve(PostDTO.fromNode(created));
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    deletePost(post) {
        return new Promise((resolve, reject) => {
            let query = ogmneo.RelationQuery.create('writes').endNode(post.objectId, 'Post');
            ogmneo.Relation.deleteMany(query).then(() => {
                ogmneo.Node.delete(PostDTO.toNode(post)).then((deleted) => {
                    resolve(PostDTO.fromNode(deleted));
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    postWithId(objectId) {
        return new Promise((resolve, reject) => {
            ogmneo.Node.nodeWithId(objectId).then((found)=> {
                if(found) {
                    resolve(PostDTO.fromNode(found));
                }else {
                    resolve(null);
                }
            }).catch((error)=> {
                reject(error);
            });
        });
    }

    postsForUser(user) {
        return new Promise((resolve, reject) => {
            let query = ogmneo.RelationQuery.create('writes').startNode(user.objectId);
            ogmneo.Relation.findNodes(query, 'end').then((nodes) => {
                resolve(nodes.map(node => PostDTO.fromNode(node.end)));
            }).catch((error) => {
                reject(error);
            });
        });
    }
}

module.exports = PostDAO;