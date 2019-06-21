const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://juca:juca@learning-graphql-qc8rw.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('>> connected do database');
});
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('>> now listening to requests on port 4000');
});