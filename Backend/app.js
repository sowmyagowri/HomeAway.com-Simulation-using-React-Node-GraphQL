//Libraries
var express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

// App Instance
var app = express();

var pool = require('./src/models/UserDB.js');

//server configuration
var port = 3001;


//use cors to allow cross origin resource sharing
var cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use("/homeaway/graphql",graphqlHTTP({
  schema,
  graphiql: true
}));

pool.query('select * from users',  function(err, rows){
  if(err) throw err;
  else {
    console.log("Connection to DB established");
  }
});  

// Execute App
app.listen(port, () => {
  console.log('HomeAway Backend running on Port: ',port);
});