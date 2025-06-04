async function sendCommand() {
  const inputEl = document.getElementById('commandInput');
  const input = inputEl.value.trim();
  const responseBox = document.getElementById('response');

  if (!input) return;

  try {
    const response = await fetch('/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: input })
    });

    const text = await response.text();
    responseBox.textContent = text;

    addToHistory(input);
    inputEl.value = '';
  } catch (err) {
    responseBox.textContent = 'Error: ' + err.message;
  }
}

function setupWebSocket() {
  const ws = new WebSocket(`ws://${location.host}`);

  ws.onopen = () => console.log('[WebSocket] Connected');

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
    setTimeout(setupWebSocket, 1000);
  };
}

function addToHistory(command) {
  let history = JSON.parse(localStorage.getItem('redisHistory') || '[]');
  if (!history.includes(command)) {
    history.unshift(command);
    if (history.length > 50) history.pop();
    localStorage.setItem('redisHistory', JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  const container = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem('redisHistory') || '[]');
  container.innerHTML = ''; // clear
  history.forEach((cmd) => {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = cmd;
    cell.classList.add('history-entry');
    cell.onclick = () => {
      document.getElementById('commandInput').value = cmd;
      document.getElementById('commandInput').focus();
    };
    row.appendChild(cell);
    container.appendChild(row);
  });
}

function clearHistory() {
  localStorage.removeItem('redisHistory');
  renderHistory();
}

document.getElementById('commandInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendCommand();
  }
});

document.getElementById('commandInput').focus();
setupWebSocket();
renderHistory();
