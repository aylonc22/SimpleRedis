import net from 'net';

const PORT = 6379;

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('+OK\r\n'); // Basic Redis-like response
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`SimpleRedis server listening on port ${PORT}`);
});