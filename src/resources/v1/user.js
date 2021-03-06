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
        this._setupGetPosts();
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
                    this.userDAO.userWithId(user.objectId).then((user) => {
                        if (user) {
                            this.userDAO.delete(user).then(() => {
                                res.send(user.asObject());
                            }).catch(() => {
                                this._internalError(res);
                            });
                        } else {
                            res.status(404).send({message: 'User not found'});
                        }
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
                    res.status(404).send({ message: 'Post not found' });
                }
            });
        });
    }

    _setupGetPosts() {
        this.router.get('/', (req, res) => {
            this.userDAO.allPopulated().then((users) => {
                res.send(users.map(user => user.asObject()));
            }).catch(() => {
                this._internalError(res);
            });
        });
    }

    _internalError(res) {
        res.status(500).send({ message: 'Internal Error' });
    }
}
module.exports = UserResource;
