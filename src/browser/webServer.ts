import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { handleCommand } from '../commands';

const indexHtml = readFileSync(join(__dirname, './public/index.html'), 'utf-8');

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
  } else if (req.method === 'POST' && req.url === '/command') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { command } = JSON.parse(body);
      const args = command.trim().split(/\s+/);
      const response = handleCommand(args);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(response);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('🌐 Web UI available at http://localhost:8080');
});
