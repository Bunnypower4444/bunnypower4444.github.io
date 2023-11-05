function setup() {
  createCanvas(400, 400);
}

class Player {
  static allPlayers = [];
  static MOVESPEED = 50; // pixels/second
  static PLAYER_RADIUS = 20;
  moveDir = 0;    //angle in degrees
  moving = false;

  constructor(name, x, y, color, id, isLocalPlayer) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.id = id;
    Player.allPlayers.push(this);
    if (isLocalPlayer) {(async () => {
      while (ws.readyState == WebSocket.CONNECTING || localid === undefined) {
        await sleep(100);
      }
      console.log("Player ID: " + localid);
      this.id = localid;
      ws.send(JSON.stringify({
        msgtype : MESSAGE_TYPES.NEW_PLAYER,
        name : this.name, 
        playerid : localid,
        x : this.x, 
        y : this.y
      }));
    })();}
  }

  startMoving(dir, updateX, updateY) {
    this.moving = true;
    this.moveDir = dir;
    if (updateX) this.x = updateX;
    if (updateY) this.y = updateY;

    if (this == player) {
      ws.send(JSON.stringify({
        msgtype : MESSAGE_TYPES.PLAYER_START_MOVING,
         dir : this.moveDir,
         updateX : this.x,
         updateY : this.y,
         id : this.id
        }));
    }
  }

  stopMoving(updateX, updateY) {
    this.moving = false;
    if (updateX) this.x = updateX;
    if (updateY) this.y = updateY;
    if (this == player) {
      ws.send(JSON.stringify({
        msgtype : MESSAGE_TYPES.PLAYER_STOP_MOVING,
         updateX : this.x,
         updateY : this.y,
         id : this.id
        }));
    }
  }

  update(deltaTime) {
    if (!this.moving) return;
    this.x += Math.cos(Math.PI * this.moveDir / 180) * Player.MOVESPEED * deltaTime / 1000;
    this.y += Math.sin(Math.PI * this.moveDir / 180) * Player.MOVESPEED * deltaTime / 1000;
  }

  draw() {
    push();
    stroke(0);
    strokeWeight(3);
    fill(this.color);
    circle(this.x, this.y, 2 * Player.PLAYER_RADIUS);
    textAlign(CENTER, CENTER);
    textSize(18);
    strokeWeight(1);
    textFont("Trebuchet MS");
    text(this.name, this.x, this.y + Player.PLAYER_RADIUS + 20);
    pop();
  }

  static getPlayerById(id) {
    for (let p of this.allPlayers) {
      if (p.id == id) return p;
    }
    return null;
  }
}

let player = new Player(prompt("Enter your name:"), 0, 0, "blue", localid, true);

function draw() {
  background(220);
  for (let p of Player.allPlayers) {
    p.update(deltaTime);
    p.draw();
  }
}

function keyPressed() {
  if (![LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)) return;
  let angle = 0;
  if (keyIsDown(LEFT_ARROW) ^ keyIsDown(RIGHT_ARROW)) angle = 180 * keyIsDown(LEFT_ARROW);
  else if (keyIsDown(UP_ARROW) ^ keyIsDown(DOWN_ARROW)) {
    player.startMoving(90 + keyIsDown(UP_ARROW) * 180);
    return;
  } else {
    player.stopMoving();
    return;
  }
  if (keyIsDown(UP_ARROW) ^ keyIsDown(DOWN_ARROW)) angle -= 90 * ((2 * keyIsDown(UP_ARROW)) - 1) * (!keyIsDown(LEFT_ARROW) * 2 - 1) / (1 + (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)));
  player.startMoving(angle);
}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function keyReleased(event) {
  if (!(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) && player.moving)) {
    player.stopMoving();
  } else if (["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(event.code)) {
    let angle = 0;
    if (keyIsDown(LEFT_ARROW) ^ keyIsDown(RIGHT_ARROW)) angle = 180 * keyIsDown(LEFT_ARROW);
    else if (keyIsDown(UP_ARROW) ^ keyIsDown(DOWN_ARROW)) {
      player.startMoving(90 + keyIsDown(UP_ARROW) * 180);
      return;
    } else {
      player.stopMoving();
      return;
    }
    if (keyIsDown(UP_ARROW) ^ keyIsDown(DOWN_ARROW)) angle -= 90 * ((2 * keyIsDown(UP_ARROW)) - 1) * (!keyIsDown(LEFT_ARROW) * 2 - 1) / (1 + (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)));
    player.startMoving(angle);
  }
}

function sleep(ms) {
  let p = new Promise(resolve => {
    setTimeout(resolve, ms);
  });
  return p;
}