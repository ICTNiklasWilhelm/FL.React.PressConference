const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });

console.log("Starting Server");

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
  });
});