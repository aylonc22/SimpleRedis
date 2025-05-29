import net from 'net';
import { parseRESP } from './parser';
import { handleCommand } from './commands';

const PORT = 6379;

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    const args= parseRESP(data);

    if(!args || args.length === 0){
        socket.write('-ERR invalid conmad\r\n');
        return;
    }
   
    const respone = handleCommand(args);

    socket.write(respone);
    

  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`SimpleRedis server listening on port ${PORT}`);
});