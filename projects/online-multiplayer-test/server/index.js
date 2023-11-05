const MESSAGE_TYPES = {
    NEW_PLAYER : 0,
    PLAYER_START_MOVING : 1,
    PLAYER_STOP_MOVING : 2,
    PLAYER_DISCONNECT : 3,
    ASSIGN_ID : 4
};
const WebSocket = require("ws");
const wss = new WebSocket.Server({port : 8080});
/**
 * @type {WebSocket}
 */
let connectedClients = [];
wss.on("connection", ws => {
    console.log("Connection");
    ws.send(JSON.stringify({msgtype : MESSAGE_TYPES.ASSIGN_ID, id : connectedClients.length}));
    connectedClients.push(ws);

    ws.on("message", msg => {
        console.log(`${msg} received from client ${connectedClients.indexOf(ws)}`)
        for (let client of connectedClients) {
            if (client == ws || !client) continue;
            client.send(`${msg}`);
        }
    });

    ws.on("close", () => {
        console.log("Client " + connectedClients.indexOf(ws) + " disconnected");
        for (let client of connectedClients) {
            if (client) client.send(JSON.stringify({msgtype : MESSAGE_TYPES.PLAYER_DISCONNECT, id : connectedClients.indexOf(ws)}));
        }
        connectedClients[connectedClients.indexOf(ws)] = null;
    });
});