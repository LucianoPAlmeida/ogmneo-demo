'use strict';

const Post = require('../../model/post');

class PostDTO {
    constructor() { }

    static fromNode(node) {
        if (node) {
            return new Post({
                objectId: node.id,
                text: node.text,
                date: new Date(node.date)
            });
        }
        return null;
    }

    static toNode(post) {
        if (post) {
            return {
                id: post.objectId,
                text: post.text,
                date: post.date
            };
        }
        return null;
    }
}

module.exports = PostDTO;