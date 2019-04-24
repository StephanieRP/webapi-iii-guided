const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan')

// router file
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function greeter(teamName) {
  return function (req, res, next) {
    req.team = teamName

    next()
  }
}

   function gateKeeper(req, res, next) {
     const seconds = new Date().getSeconds()
    if(seconds % 3 === 0) {
      res.status(404).json({ message: "Sorry cannot load at this time"})

    } else {
      next()

    }

  }
// restricted middleware, will restrict access to hubs
const restricted = (req, res, next) => {
  const password = req.headers.password;
  
  if(password === 'melon') {
    next()
  } else {
    res.status(401).send('Sorry, try your password again')
  }
  }
  
  function only(name) {
    return function (req, res, next) {
      const username = req.headers.name
      if(username !== name) {
        res.status(404).send('Sorry wrong name, cannot pass!')
      } else {
        next()
      }
    }
  }

server.use(express.json()); //built-in
server.use(helmet());
server.use(morgan('dev'));
server.use(greeter("Web 18"));
// server.use(gateKeeper);


// configure route handlers/endpoints/request handlers
server.use('/api/hubs', restricted, only("gimli"), hubsRouter);

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team}</p>
    `);
});


// we can read data from the body, url params, query string, headers

module.exports = server;

// three types of middleware: built-in, third party, custom 
