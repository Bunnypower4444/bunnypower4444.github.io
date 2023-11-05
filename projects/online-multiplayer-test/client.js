const ws = new WebSocket("wss://192.168.1.53:8080");
const MESSAGE_TYPES = {
    NEW_PLAYER : 0,
    PLAYER_START_MOVING : 1,
    PLAYER_STOP_MOVING : 2,
    PLAYER_DISCONNECT : 3,
    ASSIGN_ID : 4,
    UPDATE : 5
};
let localid;

ws.addEventListener("message", msg => {
    console.log(`${msg.data}`);
    let data = JSON.parse(`${msg.data}`);
    if (data.msgtype == MESSAGE_TYPES.NEW_PLAYER) {
        new Player(data.name, data.x, data.y, "gray", data.playerid);
        //update the new player with the existing players
        ws.send(JSON.stringify({
            msgtype : MESSAGE_TYPES.UPDATE,
            name : player.name, 
            playerid : localid,
            x : player.x, 
            y : player.y
        }));
    } else if (data.msgtype == MESSAGE_TYPES.PLAYER_START_MOVING) {
        let p = Player.getPlayerById(data.id);
        console.log(p);
        if (p && p != player) {
            p.startMoving(data.dir, data.updateX, data.updateY);
        }
    } else if (data.msgtype == MESSAGE_TYPES.PLAYER_STOP_MOVING) {
        let p = Player.getPlayerById(data.id);
        console.log(p);
        if (p && p != player) {
            p.stopMoving(data.updateX, data.updateY);
        }
    } else if (data.msgtype == MESSAGE_TYPES.PLAYER_DISCONNECT) {
        let p = Player.getPlayerById(data.id);
        if (p && p != player) {
            Player.allPlayers.splice(Player.allPlayers.indexOf(p), 1);
        }
    } else if (data.msgtype == MESSAGE_TYPES.ASSIGN_ID) {
        localid = data.id;
    } else if (data.msgtype == MESSAGE_TYPES.UPDATE) {
        let p = Player.getPlayerById(data.playerid);
        if (!p) {
            new Player(data.name, data.x, data.y, "gray", data.playerid);
        } else if (p != player) {
            p.x = data.x;
            p.y = data.y;
            p.name = data.name;
        }
    }
});
