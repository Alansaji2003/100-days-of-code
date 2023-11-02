//here we are setting the schema for our graphql server(schema means the object types the relations etc)
//import graphql from "graphql"
const graphql = require("graphql");
//we need to define the object types so...
const { GraphQLObjectType, GraphQLString,GraphQLSchema, GraphQLID,GraphQLInt, GraphQLList} = require("graphql")
const _ = require('lodash')

//dummy data
var books = [
    {name : "Name of the wind", genre :'Fantasy',id:"1", authorid:"1"},
    {name : "The Final Empire", genre :'Fantasy',id:"2", authorid: "2"},
    {name : "The Long Earth", genre :'Sci-fi',id:"3 ", authorid:"3"},
    {name : "The Final Empire", genre :'Fantasy',id:"2", authorid: "2"},
    {name : "The Long Earth", genre :'Sci-fi',id:"3 ", authorid:"3"},
    {name : "The Long Earth", genre :'Sci-fi',id:"3 ", authorid:"3"}
]
    
var authors = [
    {name : 'Patrick Rothfuss', age: 44, id:"1"},
    {name : 'Alan Saji', age: 44, id:"2"},
    {name : 'KanyeWest', age: 44, id:"3"}
]


const bookType = new GraphQLObjectType({
    name:'Book',  //name of the object 
    fields:() => ({                   //fields or properties of the object
        id: {type: GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:authorType,
            resolve(parent,args){
                return _.find(authors, {id:parent.authorid})
            }
        }
    })
})
const authorType = new GraphQLObjectType({
    name:'Author',  //name of the object 
    fields:() => ({                   //fields or properties of the object
        id: {type: GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        book:{
            type:new GraphQLList(bookType),
            resolve(parent,args){
                return _.filter(books, {authorid:parent.id})
            }
        }
    })
})
// setting up the query - how the client gets the data from the graph   
const RootQuery = new GraphQLObjectType({
    name:"RootQueryType", 
    fields:{            //each one of these fields will be a type of root query    
    book:{
        type:bookType,//here we are defining the different type of arguments the book can have to filter the data , the first argument we need is a id
        args:{id:{type:GraphQLID}},
        resolve(parent, args){
            //code to get data from db / other source
            //here we are using lodash to search through the dummy data
            return _.find(books, {id: args.id})
            
            
        }

    },
    author:{
        type:authorType,
        args:{id:{type:GraphQLID}},
        resolve(parent,args){
            return _.find(authors, {id:args.id})
        }
    },
    books: {
        type: new GraphQLList(bookType),
        resolve(parent,args){
            return books
        }
    },
    authors:{
        type:new GraphQLList(authorType),
        resolve(parent,args){
            return authors
        }
    }

                
    }                         
})
//i think this is the old method
module.exports = new GraphQLSchema({
    query:RootQuery
})
