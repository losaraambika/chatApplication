const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Import necessary modules
const cors = require('cors');
const allowedOrigins =['http://localhost:3001','http://localhost:3002']
const io = require("socket.io")(server, {
    cors: {
      origin:function (origin, callback) {
        // Check if origin is in the allowedOrigins array
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
      optionsSuccessStatus: 200,
      methods: ["GET", "POST"],
      credentials: true
    }
  });
 
const corsOptions = {
    origin:function (origin, callback) {
        // Check if origin is in the allowedOrigins array
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200
  };
  
// Use CORS middleware
app.use(cors(corsOptions));

let connectedUsers = {};

io.on('connection', (socket) => {

  // Register a new user
  socket.on('register', (username) => {
    connectedUsers[socket.id] = username;
    socket.emit('registerSuccess', `You have been registered as ${username}`);
  });

  // Handle user login
  socket.on('login', (username) => {
    // Check if the user is already registered
    if (connectedUsers[socket.id] === username) {
        socket.emit('loginSuccess', `Welcome ${username}`);
        // Handle user joining a room
        socket.on('join', (room) => {
          socket.to(room).emit('newClient',`${username} has joined ${room}`)
          socket.join(room);
        });
       
          // Handle message sending
          socket.on('message', (message, room) => {
            io.to(room).emit('message', message);
          });
        
    } else {
        socket.emit('loginFailed', 'Invalid username');
    }
  });

});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});




















// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);

// const cors = require('cors');
// const allowedOrigins =['http://localhost:3001','http://localhost:3002']
// const io = require("socket.io")(server, {
//     cors: {
//       origin:function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//       optionsSuccessStatus: 200,
//       methods: ["GET", "POST"],
//       credentials: true
//     }
//   })
     
// const corsOptions = {
//     origin:function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) === -1) {
//             var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//     optionsSuccessStatus: 200
//   }
// app.use(cors(corsOptions));

// let connectedUsers = {};

// io.on('connection', (socket) => {

//   socket.on('register', (username) => {
//     connectedUsers[socket.id] = username;
//     socket.emit('registerSuccess', `You have been registered as ${username}`);
//   });

//   socket.on('login', (username) => {
//     if (connectedUsers[socket.id] === username) {
//         socket.emit('loginSuccess', `Welcome ${username}`);
//         socket.on('join', (room) => {
//           socket.to(room).emit('newClient',`${username} has joined ${room}`)
//           socket.join(room);
//         });
       
//           socket.on('message', (message, room) => {
//             io.to(room).emit('message', message);
//           });
        
    
       
//     } else {
//         socket.emit('loginFailed', 'Invalid username');
//     }
//   });

// });

// server.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
