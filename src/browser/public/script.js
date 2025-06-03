async function sendCommand() {
  const input = document.getElementById('commandInput').value;
  const responseBox = document.getElementById('response');

  try {
   const response = await fetch('/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: input })
    });

    const text = await response.text();
    responseBox.textContent = text;
  } catch (err) {
    responseBox.textContent = 'Error: ' + err.message;
  }
}

function setupWebSocket() {
  const ws = new WebSocket(`ws://${location.host}`);

  ws.onopen = () => {
    console.log('[WebSocket] Connected');
  };

  ws.onmessage = (event) => {
    console.log('[WebSocket] Message received:', event.data);
    if (event.data === 'reload') {
      console.log('[LiveReload] Reloading page...');
      location.reload();
    }
  };

  ws.onerror = (err) => {
    console.warn('[WebSocket] connection error:', err);
  };

  ws.onclose = () => {
    console.warn('[WebSocket] connection closed. Reconnecting in 1s...');
    setTimeout(setupWebSocket, 1000); // try reconnecting
  };
}

setupWebSocket();