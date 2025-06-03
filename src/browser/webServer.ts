import { createServer } from 'node:http';
import { readFileSync, existsSync, createReadStream } from 'node:fs';
import { join, extname } from 'node:path';
import { handleCommand } from '../commands';
import WebSocket, { WebSocketServer } from 'ws';

const PUBLIC_DIR = join(__dirname, 'public');

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      const indexHtml = readFileSync(join(PUBLIC_DIR, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
    } else {
      // Try to serve static file
      const filePath = join(PUBLIC_DIR, decodeURIComponent(req.url || ''));
      if (existsSync(filePath)) {
        const ext = extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    }
  } else if (req.method === 'POST' && req.url === '/command') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { command } = JSON.parse(body);
        const args = command.trim().split(/\s+/);
        const response = handleCommand(args);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(response);
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('🌐 Web UI available at http://localhost:8080');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws:WebSocket) => {
  console.log('Client connected to WS for live reload');
});

// Broadcast reload message to all clients
function broadcastReload() {
  wss.clients.forEach((client:WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
}

// --- Watch your public folder and notify clients on changes ---
import { watch } from 'chokidar';

const watcher = watch(join(__dirname, 'public'), { ignoreInitial: true });
watcher.on('all', (event, path) => {
  console.log(`File ${path} changed, sending reload signal`);
  broadcastReload();
});