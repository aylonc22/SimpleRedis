import net from 'net';
import { parseRESP } from './parser';
import { _loadSnapshot, _saveSnapshot, handleCommand } from './commands';

const PORT = 6379;

const server = net.createServer((socket) => {
   const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
   console.log(`[+] Client connected: ${clientAddress}`);

  socket.on('data', (data) => {
    const args= parseRESP(data);

     console.log(`[>] Received from ${clientAddress}:`, data.toString().replace(/\r\n/g, '\\r\\n'));

    if(!args || args.length === 0){
         const errorMsg = "-ERR invalid input\r\n";
         console.log(`[<] Sent to ${clientAddress}: ${errorMsg.trim()}`);
        socket.write(errorMsg);
        return;
    }
   
    const response = handleCommand(args);


    console.log(`[CMD]`, args);
    console.log(`[<] Sent to ${clientAddress}: ${response.trim()}`);
    socket.write(response);
    

  });

  socket.on('end', () => {
      console.log(`[-] Client disconnected: ${clientAddress}`);
  });

 socket.on('error', (err) => {
    console.error(`[!] Error with ${clientAddress}:`, err.message);
  });

});

server.listen(PORT, () => {
    _loadSnapshot();
  console.log(`SimpleRedis server listening on port ${PORT}`);
});

process.on('SIGINT',()=>{
    _saveSnapshot();
    console.log("System Shutdown");
});