const express = require('express');
//this is an express middleware which is used by express to understand graphql
//import {graphqlHTTP} from "express-graphql";
const {graphqlHTTP} = require('express-graphql');
//import GraphQLSchema from "./schema/schema.js";
const GraphQLSchema = require("./schema/schema.js");

const app = express();

//the graphqlHTTP method is needed for setting up the schema
app.use('/graphql', graphqlHTTP({
    schema:GraphQLSchema,                                              //this means schema : schema
    graphiql:true
}))






//listening on port
app.listen(3000, () => {
    console.log("Server active on port 3000")
})