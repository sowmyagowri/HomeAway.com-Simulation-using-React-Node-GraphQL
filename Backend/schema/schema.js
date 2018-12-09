const graphql = require('graphql');
const _ = require('lodash');
var pool = require('../src/models/UserDB');
var crypt = require('../src/models/bcrypt.js');
var validator = require('validator');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

const UserLoginType = new GraphQLObjectType({
    name: 'UserLogin',
    fields: ( ) => ({
        cookie1: { type: GraphQLString },
        cookie2: { type: GraphQLString },
        cookie3: { type: GraphQLString },
        status: {type: GraphQLInt},
        message: { type: GraphQLString },
    })
});

const UserProfileType = new GraphQLObjectType({
    name: 'UserProfile',
    fields: ( ) => ({
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        created: { type: GraphQLInt },
        aboutMe: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        company: { type: GraphQLString },
        school: { type: GraphQLString },
        hometown: { type: GraphQLString },
        gender: { type: GraphQLString },
        phone: { type: GraphQLInt },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        profilefetch : {
            type : UserProfileType,
            args: {
                email: { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise( (resolve, reject ) => {
                    console.log(args.email);
                    pool.query('SELECT * FROM users WHERE email = ?', [args.email], (err, result) => {
                        if (err){
                            console.log(err);
                        } else {
                            console.log(result[0]);
                            resolve ( result[0] );
                        }
                    })
                })
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
    
        travellerlogin: {
            type : UserLoginType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args){
                return new Promise( (resolve, reject ) => {
                    console.log("Inside traveller Login Mutation");
                    var email = args.email;
                    var lowercaseemail = email.toLowerCase();
                    var trimemail = lowercaseemail.trim();
                    var password = args.password;
                    
                    pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
                        if (err) {
                            console.log("User does not exist");
                        } else {
                            if (rows.length > 0) {
                                // Check if password matches
                                crypt.compareHash(password, rows[0].password, function (err, isMatch) {
                                    if (isMatch && !err) {
                                        console.log("Traveller found in DB");
                                        let cookies = {
                                            cookie1: "travellercookie",
                                            cookie2: trimemail,
                                            cookie3: rows[0].firstname,
                                            status: 200,
                                            message: "Login Successful"
                                        }
                                        resolve ( cookies )
                                    } else {
                                        console.log("Authentication failed. Passwords did not match.");
                                        let cookies = {
                                            cookie1: null,
                                            cookie2: null,
                                            cookie3: null,
                                            status: 401,
                                            message: "Authentication failed. Passwords did not match."
                                        }
                                        resolve ( cookies )
                                    }
                                })
                            }
                            else {
                                console.log("Authentication failed. User does not exist.");
                                let cookies = {
                                    cookie1: null,
                                    cookie2: null,
                                    cookie3: null,
                                    status: 402,
                                    message: "Authentication failed. User does not exist."
                                }
                                resolve ( cookies )
                            }
                        }
                    })
                })
            }
        },

        ownerlogin: {
            type : UserLoginType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args){
                return new Promise( (resolve, reject ) => {
                    console.log("Inside owner Login Mutation");
                    var email = args.email;
                    var lowercaseemail = email.toLowerCase();
                    var trimemail = lowercaseemail.trim();
                    var password = args.password;
                    
                    pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
                        if (err) {
                            console.log("User does not exist");
                            let cookies = {
                                cookie1: null,
                                cookie2: null,
                                cookie3: null,
                                status: 401,
                                message: "User does not exist"
                            }
                            resolve ( cookies )
                        } else {
                            if (rows.length > 0) {
                                // Check if password matches
                                crypt.compareHash(password, rows[0].password, function (err, isMatch) {
                                    if (isMatch && !err) {
                                        if (rows[0].isOwner == 'Y') {
                                            console.log("Owner found in DB");
                                            let cookies = {
                                                cookie1: "ownercookie",
                                                cookie2: trimemail,
                                                cookie3: rows[0].firstname,
                                                status: 200,
                                                message: "Login Successful"
                                            }
                                            resolve ( cookies )
                                        } else {
                                            console.log("User is not an Owner.");
                                            let cookies = {
                                                cookie1: null,
                                                cookie2: null,
                                                cookie3: null,
                                                status: 401,
                                                message: "User is not an Owner."
                                            }
                                            resolve ( cookies )
                                        }
                                    } else {
                                        console.log("Authentication failed. Passwords did not match.");
                                        let cookies = {
                                            cookie1: null,
                                            cookie2: null,
                                            cookie3: null,
                                            status: 402,
                                            message: "Authentication failed. Passwords did not match."
                                        }
                                        resolve ( cookies )
                                    }
                                })
                            }
                            else {
                                console.log("Authentication failed. User does not exist.");
                                let cookies = {
                                    cookie1: null,
                                    cookie2: null,
                                    cookie3: null,
                                    status: 403,
                                    message: "Authentication failed. User does not exist."
                                }
                                resolve ( cookies )
                            }
                        }
                    })
                })
            }
        },

        travellersignup: {
            type : UserLoginType,
            args: {
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args){
                return new Promise( (resolve, reject ) => {
                    console.log("In traveller Signup Mutation");
                    email = args.email.toLowerCase();
                    trimemail = email.trim();
                    var today = new Date();
                    var year = today.getFullYear();
                    
                    pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
                        if (err){
                            console.log(err);
                            console.log("unable to read the database");
                        } else if (rows.length > 0) {
                            if (rows[0].isOwner == 'Y') {
                                console.log("Traveller already exists");
                                let cookies = {
                                    cookie1: null,
                                    cookie2: null,
                                    cookie3: null,
                                    status: 400,
                                    message: "Traveller already exists"
                                }
                                resolve ( cookies )
                            } else {
                                crypt.createHash(args.password, function (response) {
                                    encryptedPassword = response;
                                
                                    var userData = {
                                        "firstname": args.firstname,
                                        "lastname": args.lastname,
                                        "email": trimemail,
                                        "password": encryptedPassword,
                                        "created": year,
                                        "isOwner": 'N'
                                    }
                                
                                    //Save the user in database
                                    pool.query('INSERT INTO users SET ?', userData, function (err) {
                                        if (err) {
                                            console.log("unable to insert into database");
                                        } else {
                                            console.log("Traveller Added");
                                            let cookies = {
                                                cookie1: "travellercookie",
                                                cookie2: trimemail,
                                                cookie3: args.firstname,
                                                status: 200,
                                                message: "Traveller added"
                                            }
                                            resolve ( cookies )
                                        }
                                    });
                                })
                            }
                        }
                    })
                })
            }
        },

        ownersignup: {
            type : UserLoginType,
            args: {
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args){
                return new Promise( (resolve, reject ) => {
                    console.log("In owner Signup Mutation");
                    email = args.email.toLowerCase();
                    trimemail = email.trim();
                    var today = new Date();
                    var year = today.getFullYear();
                    
                    pool.query('SELECT * FROM users WHERE email = ?', [trimemail], (err, rows) => {
                        if (err){
                            console.log(err);
                            console.log("unable to read the database");
                        } else {
                            if (rows.length > 0) {
                                if (rows[0].isOwner == 'Y') {
                                    console.log("Owner already exists");
                                    let cookies = {
                                        cookie1: null,
                                        cookie2: null,
                                        cookie3: null,
                                        status: 400,
                                        message: "Owner already exists"
                                    }
                                    resolve ( cookies )
                                } else{

                                //Update traveller as owner in database
                                var sqlquery = "UPDATE users SET isOwner = 'Y' where email = ?";
                                pool.query(sqlquery, [trimemail], (err) =>  {
                                    if (err) {
                                        console.log(err);
                                        console.log("unable to update user to owner");
                                        let cookies = {
                                            cookie1: null,
                                            cookie2: null,
                                            cookie3: null,
                                            status: 400,
                                            message: "Unable to update user to owner"
                                        }
                                        resolve ( cookies )
                                    } else{
                                        console.log("Owner profile added to traveller login");
                                        let cookies = {
                                            cookie1: "ownercookie",
                                            cookie2: trimemail,
                                            cookie3: args.firstname,
                                            status: 201,
                                            message: "Owner profile added to traveller login"
                                        }
                                        resolve ( cookies )
                                    }
                                })
                                }
                            } else {

                                crypt.createHash(args.password, function (response) {
                                    encryptedPassword = response;
                                
                                    var userData = {
                                        "firstname": args.firstname,
                                        "lastname": args.lastname,
                                        "email": trimemail,
                                        "password": encryptedPassword,
                                        "created": year,
                                        "isOwner": 'Y'
                                    }
                                
                                    //Save the user in database
                                    pool.query('INSERT INTO users SET ?', userData, function (err) {
                                    if (err) {
                                        console.log("unable to insert into database");
                                    } else {
                                        console.log("Owner Added");
                                        let cookies = {
                                            cookie1: "ownercookie",
                                            cookie2: trimemail,
                                            cookie3: args.firstname,
                                            status: 200,
                                            message: "Owner added"
                                        }
                                        resolve ( cookies )
                                    }});
                                })
                            }
                        }
                    })
                })
            }
        },

        profilesave: {
            type : UserLoginType,
            args: {
                email: { type: GraphQLString },
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                aboutMe : { type: GraphQLString },
                city : { type: GraphQLString },
                state : { type: GraphQLString },
                country : { type: GraphQLString },
                company : { type: GraphQLString },
                school : { type: GraphQLString },
                hometown : { type: GraphQLString },
                languages : { type: GraphQLString },
                gender : { type: GraphQLString },
                phone : { type: GraphQLString }
            },
            resolve(parent, args){
                return new Promise( (resolve, reject ) => {
                    console.log("In Profile Save Mutation");
                    if (args.firstname === "" || args.lastname === "")
                    {
                        resolve ("Firstname/Lastname is required")
                    } else {
                        email = args.email.toLowerCase();
                        trimemail = email.trim();
                        
                        var userData = {
                            "firstname": args.firstname,
                            "lastname": args.lastname,
                            "aboutMe" : args.aboutMe,
                            "city" : args.city,
                            "state" : args.state,
                            "country" : args.country,
                            "company" : args.company,
                            "school" : args.school,
                            "hometown" : args.hometown,
                            "languages" : args.languages,
                            "gender" : args.gender,
                            "phone" : args.phone
                        }
                        
                        console.log(userData);
                        pool.query('UPDATE users SET ? WHERE email = ?', [userData, trimemail], function (err) {
                            if (err) {
                            console.log(err);
                            console.log("unable to update database");
                            resolve ( err )
                            } else {
                                let responseMessage = {
                                    status: 200,
                                    message: "Profile Updated"
                                }
                                resolve ( responseMessage )
                            }
                        })
                    }
                })
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});