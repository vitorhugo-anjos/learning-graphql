const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');
const { 
    GraphQLObjectType, 
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLString,
    GraphQLSchema,
 } = graphql;
const _ = require('lodash');

const books = [
    { name: 'Book 1', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'Book 2', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'Book 3', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'Book 4', genre: 'Sci-Fi', id: '4', authorId: '2' },
    { name: 'Book 6', genre: 'Sci-Fi', id: '6', authorId: '3' },
    { name: 'Book 6', genre: 'Sci-Fi', id: '6', authorId: '3' },
];

const authors = [
    { name: 'Author 1', age: 44, id: '1' },
    { name: 'Author 2', age: 42, id: '2' },
    { name: 'Author 3', age: 66, id: '3' },
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, { id: parent.authorId});
            }
        }
    }),
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, { authorId: parent.id });
            }
        }
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // code to get data from data source
                return _.find(books, { id: args.id });
            },
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return authors;
            }
        }
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age,
                });
                author.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});