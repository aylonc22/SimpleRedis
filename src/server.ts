import net from 'net';
import { parseRESP } from './parser';

const PORT = 6379;

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    const args= parseRESP(data);

    if(!args || args.length === 0){
        socket.write('-ERR invalid conmad\r\n');
        return;
    }

    const commad = args[0].toUpperCase();

    switch (commad) {
        case 'PING':
            socket.write('+PONG\r\n');
            break;
    
        default:
            socket.write(`-ERR unkown command: ${commad}\r\n`);
            break;
    }
    
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`SimpleRedis server listening on port ${PORT}`);
});