const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const users = {};
//starting connection
io.on('connection', socket => {
    //listening
    socket.on('new-user-joined', name => {
        console.log(`${name} joined with ID: ${socket.id}`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log(`Received message from ${users[socket.id]}, type : ${message.type}`);
        socket.broadcast.emit('receive', { ...message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        console.log(`${users[socket.id]} with ID: ${socket.id} disconnected`);
        socket.broadcast.emit('disconnected', users[socket.id]);
        delete users[socket.id];
    });
});
