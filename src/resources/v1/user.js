'use strict';
const express = require('express');

const User = require('../../business/model/user');
const Post = require('../../business/model/post');
const UserDAO = require('../../business/DAO/user-dao');
const PostDAO = require('../../business/DAO/post-dao');

class UserResource {

    constructor() {
        this._router = express.Router();
        this._setup();
        this._userDAO = new UserDAO();
        this._postDAO = new PostDAO();
    }

    get userDAO() {
        return this._userDAO;
    }
    get postDAO() {
        return this._postDAO;
    }

    _setup() {
        this._setupSave();
        this._setupUpdate();
        this._setupDelete();
        this._setupAddPost();
        this._setupDeletePost();
    }

    get router() {
        return this._router;
    }

    _setupSave() {
        this.router.post('/', (req, res) => {
            let user = new User(req.body);
            this.userDAO.save(user).then((user) => {
                res.send(user.asObject());
            }).catch(() => {
                this._internalError(res);
            });
        });
    }

    _setupUpdate() {
        this.router.put('/:userId', (req, res) => {
            let user = new User(req.body);
            user.objectId = parseInt(req.params.userId);
            this.userDAO.update(user).then((user) => {
                res.send(user.asObject());
            }).catch(() => {
                this._internalError(res);
            });
        });
    }

    _setupDelete() {
        this.router.delete('/:userId', (req, res) => {
            let user = new User({ objectId: parseInt(req.params.userId) });
            this.userDAO.hasPosts(user).then((hasPosts) => {
                if (!hasPosts) {
                    this.userDAO.delete(user).then((deleted) => {
                        res.send(deleted.asObject());
                    }).catch(() => {
                        this._internalError(res);
                    });
                } else {
                    res.status(400).send({ message: 'User can\'t be deleted because there\'s posts associated to him' });
                }
            }).catch(() => {
                this._internalError(res);
            });
        });
    }

    _setupAddPost() {
        this.router.post('/:userId/posts', (req, res) => {
            let user = new User({ objectId: parseInt(req.params.userId) });
            let post = new Post(req.body);
            this.postDAO.saveForUser(post, user).then((createdPost) => {
                res.send(createdPost.asObject());
            }).catch(() => {
                this._internalError(res);
            });
        });
    }

    _setupDeletePost() {
        this.router.delete('/:userId/posts/:postId', (req, res) => {
            this.postDAO.postWithId(parseInt(req.params.postId)).then((foundPost) => {
                if (foundPost) {
                    this.postDAO.deletePost(foundPost).then(() => {
                        res.send(foundPost.asObject());
                    }).catch(() => {
                        this._internalError(res);
                    });
                } else {
                    res.status(404).send({ message: 'Post not found'});
                }
            });
        });
    }

    _internalError(res) {
        res.status(500).send({ message: 'Internal Error' });
    }
}
module.exports = UserResource;
