'use strict';

const GraphQL = require('graphql');
const GraphqlHTTP = require('express-graphql');
const PostDAO = require('../../../business/DAO/post-dao');
const UserDAO = require('../../../business/DAO/user-dao');
const _ = require('lodash');

class UserGraphQL {

    constructor() {
        this.setupPostSchema();
        this.setupUserSchema();
        this._userDAO = new UserDAO();
        this._postDAO = new PostDAO();
    }

    get userDAO() {
        return this._userDAO;
    }

    get postDAO() {
        return this._postDAO;
    }

    get userSchema() {
        return this._userSchema;
    }

    get postSchema() {
        return this._postSchema;
    }

    setupUserSchema() {
        this._userSchema = new GraphQL.GraphQLObjectType({
            name: 'User',
            description: 'User schema',
            fields: () => ({
                objectId: {
                    type: GraphQL.GraphQLInt
                },
                name: {
                    type: GraphQL.GraphQLString
                },
                email: {
                    type: GraphQL.GraphQLString
                },
                registeredAt: {
                    type: GraphQL.GraphQLString,
                    resolve: (user) => { return (user.registeredAt && _.isFunction(user.registeredAt.toISOString)) ? user.registeredAt.toISOString() : null; }
                },
                posts: {
                    type: new GraphQL.GraphQLList(this.postSchema),
                    resolve: (user) => {
                        return this.postDAO.postsForUser(user);
                    }
                }
            })
        });
    }

    setupPostSchema() {
        this._postSchema = new GraphQL.GraphQLObjectType({
            name: 'Post',
            description: 'Post schema',
            fields: () => ({
                objectId: {
                    type: GraphQL.GraphQLInt
                },
                text: {
                    type: GraphQL.GraphQLString
                },
                date: {
                    type: GraphQL.GraphQLString,
                    resolve: (post) => { return (post.date && _.isFunction(post.date.toISOString)) ? post.date.toISOString() : null; }
                }
            })
        });
    }

    get route() {
        return new GraphqlHTTP({
            schema: new GraphQL.GraphQLSchema({
                query: new GraphQL.GraphQLObjectType({
                    name: 'Users',
                    fields: () => ({
                        users: {
                            type: new GraphQL.GraphQLList(this.userSchema),
                            resolve: () => {
                                return this.userDAO.all();
                            }
                        }
                    })
                }),
            }),
            graphiql: true
        });
    }
}

module.exports = UserGraphQL;