const game = {
  canvas: document.getElementById("canvas"),
  ctx: this.canvas.getContext("2d"),
  canvasOriginalWidth: 800,
  canvasOriginalHeight: 600,
  canvasWidth: window.innerWidth * 0.6,
  canvasHeight: window.innerWidth * 0.6 * 0.75, // 0.75 is the result of dividing 600 by 800.
  canvasProportion: (window.innerWidth * 0.6) / 800, // I have to multiply every drawn w, h, x and y by this in order to keep the proportions as they were when the canvas measured 800 x 600.
  heartsArray: document.getElementsByClassName("heart"),
  isStarted: false,
  intervalId: null,
  count: 0,
  ghosts: [],
  cheatString: {
    mistOff: "",
    mistOn: "",
  },
  // "document.createElement("img")" is exactly the same as "new Image()"
  heartsDisplay: document.querySelector("img.life"),
  introduction: new Image(),
  background: new Image(),
  mist: new Image(),
  gameOverImg: new Image(),
  gameWinImg: new Image(),

  setCanvasSize: function () {
    document.getElementById("canvas").setAttribute("width", this.canvasWidth);
    document.getElementById("canvas").setAttribute("height", this.canvasHeight);
  },
  getReady: function () {
    this.setCanvasSize();
    this.introduction.src = "./images/intro.png";
    this.background.src = "./images/canvas-background.png";
    this.mist.src = "images/mist.png";
    this.gameOverImg.src = "./images/gameover.png";
    this.gameWinImg.src = "./images/youdidit.png";
    player.setSpriteSrc();
    door.setSpriteSrc();
  },
  newGame: function () {
    if (!this.isStarted) {
      this.isStarted = true;
      this.intervalId = setInterval(update, 60);
      player.x = 401;
      player.y = 290;
      player.w = 18;
      player.h = 23;
      player.gradX = -393;
      player.gradY = -295;
      player.countGhostCollisions = 0;
      player.direction = "standingDown";
      this.ghosts = [];
      for (let i = 0; i < 3; i++) {
        this.ghosts.push(new GhostTop());
        this.ghosts.push(new GhostRight());
        this.ghosts.push(new GhostBottom());
        this.ghosts.push(new GhostLeft());
        this.ghosts.push(new GhostRightMidway());
        this.ghosts.push(new GhostLeftMidway());
      }
      this.ghosts.forEach((ghost) => ghost.setSpriteSrc());
      door.chooseBorder();
      door.chooseLocation(door.borderChosen);
    }
    for (let i = 0; i < this.heartsArray.length; i++) {
      this.heartsArray[i].style.display = "inline";
    }
  },
  gameOver: function () {
    this.ctx.drawImage(this.gameOverImg, 50 * this.canvasProportion, 105 * this.canvasProportion, 700 * this.canvasProportion, 445 * this.canvasProportion);
    clearInterval(this.intervalId);
    this.isStarted = false;
    this.heartsArray[0].style.display = "none";
  },
  gameWin: function () {
    this.ctx.drawImage(this.gameWinImg, 100 * this.canvasProportion, 0 * this.canvasProportion, 600 * this.canvasProportion, 600 * this.canvasProportion);
    clearInterval(this.intervalId);
    this.isStarted = false;
  },
};

window.onload = () => {
  game.getReady();
  game.background.addEventListener("load", () => {
    game.ctx.drawImage(game.introduction, 0, 0, game.canvasWidth, game.canvasHeight);
  });
  addKeyboardEventListeners();
  document.getElementById("play-button").addEventListener("click", () => game.newGame());
  // Note that putting "game.newGame" as the callback function
  // works different than putting "() => game.newGame()".
  // In the first case I seem to be unable to clearInterval!
};

const player = {
  // Initial positions:
  x: 401,
  y: 290,
  w: 18,
  h: 23,
  gradX: -393,
  gradY: -295,
  direction: "standingDown",
  stepCount: 0,
  countGhostCollisions: 0,
  sprite: new Image(),
  setSpriteSrc: function () {
    this.sprite.src = "./images/BILLY_BIT.png";
  },
  spritePositions: {
    //BILLY_BIT.png
    standingUp: { x_ini: 0, y_ini: 48 },
    up: [
      { x_ini: 16, y_ini: 48 },
      { x_ini: 32, y_ini: 48 },
    ],
    standingRight: { x_ini: 0, y_ini: 32 },
    right: [
      { x_ini: 47, y_ini: 32 },
      { x_ini: 63, y_ini: 32 },
    ],
    standingDown: { x_ini: 0, y_ini: 0 },
    down: [
      { x_ini: 16, y_ini: 0 },
      { x_ini: 32, y_ini: 0 },
    ],
    standingLeft: { x_ini: 0, y_ini: 16 },
    left: [
      { x_ini: 47, y_ini: 16 },
      { x_ini: 63, y_ini: 16 },
    ],
  },
  movementTimeoutIds: {
    timeoutIdUp: null,
    timeoutIdRight: null,
    timeoutIdDown: null,
    timeoutIdLeft: null,
  },
  clearAllDirectionTimeoutIds: function () {
    Object.keys(this.movementTimeoutIds).forEach((key) => clearTimeout(this.movementTimeoutIds[key]));
  },
  canMoveTo: function (newX, newY) {
    const playerRect = {
      x: newX,
      y: newY,
      w: this.w,
      h: this.h,
    };
    for (const obstacle of obstacles) {
      if (isColliding(playerRect, obstacle)) {
        return false;
      }
    }
    return true;
  },
  recalculatePosition: function (incX, incY) {
    let newX = this.x + incX;
    let newY = this.y + incY;

    if (this.canMoveTo(newX, newY)) {
      if (newX >= 0 && newX <= game.canvasOriginalWidth - this.w) {
        this.x = newX;
        this.gradX += incX;
      }
      if (newY >= 0 && newY <= game.canvasOriginalHeight - this.h) {
        this.y = newY;
        this.gradY += incY;
      }
    }
  },
  printStanding: function (direction) {
    game.ctx.drawImage(this.sprite, this.spritePositions[direction].x_ini, this.spritePositions[direction].y_ini, 12, 16, this.x * game.canvasProportion, this.y * game.canvasProportion, this.w * game.canvasProportion, this.h * game.canvasProportion);
  },
  printMoving: function (direction) {
    if (this.spritePositions[direction][0]) {
      if (player.stepCount % 2 === 0) {
        game.ctx.drawImage(this.sprite, this.spritePositions[direction][0].x_ini, this.spritePositions[direction][0].y_ini, 12, 16, this.x * game.canvasProportion, this.y * game.canvasProportion, this.w * game.canvasProportion, this.h * game.canvasProportion);
      } else {
        game.ctx.drawImage(this.sprite, this.spritePositions[direction][1].x_ini, this.spritePositions[direction][1].y_ini, 12, 16, this.x * game.canvasProportion, this.y * game.canvasProportion, this.w * game.canvasProportion, this.h * game.canvasProportion);
      }
    }
  },
  print: function () {
    if (this.direction === "standingUp" || "standingRight" || "standingDown" || "standingLeft") this.printStanding(this.direction);
    if (this.direction === "up" || "right" || "down" || "left") this.printMoving(this.direction);
  },
  checkGhostCollision: function () {
    for (let i = 0; i < game.ghosts.length; i++) {
      let ghost = game.ghosts[i];
      if (isColliding(this, ghost)) {
        this.countGhostCollisions++;
        if (this.countGhostCollisions < 5) {
          this.x = 401;
          this.y = 290;
          this.gradX = -393;
          this.gradY = -295;
        } else {
          game.gameOver();
        }
      }
    }
  },
};

const door = {
  x: null,
  y: null,
  w: 40,
  h: 40,
  borderChosen: null,
  borders: {
    // Places where the door can appear. Assuming a canvas of 800 * 600px.
    top: [
      // y = 15
      { initX: 6, endX: 180 },
      { initX: 259, endX: 755 },
    ],
    right: [
      // x = 771
      { initY: 30, endY: 145 },
      { initY: 226, endY: 390 },
      { initY: 476, endY: 560 },
    ],
    bottom: [
      // y = 572
      { initX: 6, endX: 370 },
      { initX: 432, endX: 765 },
    ],
    left: [
      // x = -15
      { initY: 30, endY: 348 },
      { initY: 428, endY: 560 },
    ],
  },
  sprite: {
    top: new Image(),
    right: new Image(),
    bottom: new Image(),
    left: new Image(),
  },
  setSpriteSrc: function () {
    this.sprite.top.src = "./images/door_up.png";
    this.sprite.right.src = "./images/door_right.png";
    this.sprite.bottom.src = "./images/door_down.png";
    this.sprite.left.src = "./images/door_left.png";
  },
  chosenSprite: null,
  print: function () {
    game.ctx.drawImage(this.chosenSprite, this.x * game.canvasProportion, this.y * game.canvasProportion, this.w * game.canvasProportion, this.h * game.canvasProportion);
  },
  checkPlayerCollision: function () {
    if (isColliding(player, this)) {
      game.gameWin();
    }
  },
  // I want the chance of the door being in one border of the canvas proportional to the available space in pixels.
  getBorderSpace: function (border) {
    return border.reduce((acc, curr) => {
      if (curr.initX) return acc + (curr.endX - curr.initX);
      else return acc + (curr.endY - curr.initY);
    }, 0); // Sums the pixels each border has available.
  },
  // Randomly determine the direction where the door will be set, taking into account the available space in pixels:
  chooseBorder: function () {
    const chanceAccordingToBorderSize = Math.floor(Math.random() * (this.getBorderSpace(door.borders.top) + this.getBorderSpace(door.borders.right) + this.getBorderSpace(door.borders.bottom) + this.getBorderSpace(door.borders.left)));
    if (chanceAccordingToBorderSize < this.getBorderSpace(door.borders.top)) {
      door.borderChosen = "top";
      return;
    } else if (chanceAccordingToBorderSize < this.getBorderSpace(door.borders.top) + this.getBorderSpace(door.borders.right)) {
      door.borderChosen = "right";
      return;
    } else if (chanceAccordingToBorderSize < this.getBorderSpace(door.borders.top) + this.getBorderSpace(door.borders.right) + this.getBorderSpace(door.borders.bottom)) {
      door.borderChosen = "bottom";
      return;
    } else {
      door.borderChosen = "left";
      return;
    }
  },
  chooseLocation: function (direction) {
    const fragment = Math.floor(Math.random() * door.borders[direction].length);
    const borderFragment = door.borders[direction][fragment];
    if (door.borderChosen == "top") {
      door.x = getRandom(borderFragment.initX, borderFragment.endX);
      door.y = 15;
      door.h = 42;
      door.chosenSprite = door.sprite.top;
    } else if (door.borderChosen == "right") {
      door.x = 771;
      door.y = getRandom(borderFragment.initY, borderFragment.endY);
      door.chosenSprite = door.sprite.right;
    } else if (door.borderChosen == "bottom") {
      door.x = getRandom(borderFragment.initX, borderFragment.endX);
      door.y = 572;
      door.chosenSprite = door.sprite.bottom;
    } else if (door.borderChosen == "left") {
      door.x = -15;
      door.y = getRandom(borderFragment.initY, borderFragment.endY);
      door.chosenSprite = door.sprite.left;
    }
    // console.log("door direction, x, y, w, h: ", borderChosen, door.x, door.y, door.w, door.h)
  },
};

const obstacles = [
  // obstacle data here:
  { x: 0, y: 0, w: 800, h: 32 }, //1 (todo el lado superior)
  { x: 220, y: 0, w: 40, h: 88 }, //2
  { x: 220, y: 120, w: 40, h: 149 }, //4
  { x: 260, y: 160, w: 160, h: 48 }, //5
  { x: 440, y: 160, w: 160, h: 48 }, //6
  { x: 560, y: 208, w: 40, h: 50 }, //7
  { x: 600, y: 180, w: 100, h: 44 }, //8
  { x: 720, y: 180, w: 80, h: 44 }, //9
  { x: 0, y: 380, w: 80, h: 52 }, //10
  { x: 100, y: 380, w: 160, h: 52 }, //11
  { x: 220, y: 300, w: 40, h: 80 }, //12
  { x: 240, y: 400, w: 80, h: 48 }, //13
  { x: 340, y: 400, w: 160, h: 48 }, //14
  { x: 520, y: 400, w: 80, h: 48 }, //15
  { x: 560, y: 300, w: 40, h: 100 }, //16
  { x: 580, y: 420, w: 180, h: 44 }, //17
  { x: 780, y: 420, w: 20, h: 44 }, //18
  { x: 400, y: 448, w: 40, h: 48 }, //19
  { x: 400, y: 540, w: 40, h: 60 }, //20
];

function isColliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y;
  // it will only return true if all conditions are true at once.
}

// Function to generate a random number within a range
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Ghost {
  constructor() {
    this.x = 200;
    this.y = 200;
    this.w = 18;
    this.h = 23;
    this.speedX = 2; // horizontal movement speed
    this.speedY = 1; // vertical movement speed
    this.sprite = new Image();
  }
  setSpriteSrc() {
    this.sprite.src = "./images/ghost1.png";
  }
  print() {
    // Update ghost position based on its speed
    this.x += this.speedX;
    this.y += this.speedY;
    // Draw ghost image at new position
    game.ctx.drawImage(this.sprite, this.x * game.canvasProportion, this.y * game.canvasProportion, this.w * game.canvasProportion, this.h * game.canvasProportion);
  }
}

class GhostTop extends Ghost {
  constructor() {
    super();
    this.x = Math.random() * 800;
    this.y = 0;
  }
}
class GhostLeft extends Ghost {
  constructor() {
    super();
    this.x = 0;
    this.y = Math.random() * 600;
    this.speedX = 2;
    this.speedY = -1;
  }
}
class GhostRight extends Ghost {
  constructor() {
    super();
    this.x = 800;
    this.y = Math.random() * 600;
    this.speedX = -2;
    this.speedY = 1;
  }
}
class GhostBottom extends Ghost {
  constructor() {
    super();
    this.x = Math.random() * 800;
    this.y = 600;
    this.speedX = -2;
    this.speedY = -1;
  }
}
class GhostLeftMidway extends Ghost {
  constructor() {
    super();
    this.x = 160;
    this.y = Math.random() * 600;
    this.speedX = 2;
    this.speedY = -1;
  }
}
class GhostRightMidway extends Ghost {
  constructor() {
    super();
    this.x = 640;
    this.y = Math.random() * 600;
    this.speedX = -2;
    this.speedY = 1;
  }
}

///////////////////////////////
/////////// INTERVAL //////////
const update = function () {
  game.count++;
  // CLEAN
  game.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  // GENERATE GHOSTS
  if (game.count % 35 == 0) {
    let ghostTop = new GhostTop();
    let ghostLeft = new GhostLeft();
    let ghostRight = new GhostRight();
    let ghostBottom = new GhostBottom();
    ghostTop.setSpriteSrc();
    ghostLeft.setSpriteSrc();
    ghostRight.setSpriteSrc();
    ghostBottom.setSpriteSrc();
    game.ghosts.push(ghostTop);
    game.ghosts.push(ghostLeft);
    game.ghosts.push(ghostRight);
    game.ghosts.push(ghostBottom);
  }
  // CHECK LIFE
  if (player.countGhostCollisions === 1) game.heartsArray[4].style.display = "none";
  else if (player.countGhostCollisions === 2) game.heartsArray[3].style.display = "none";
  else if (player.countGhostCollisions === 3) game.heartsArray[2].style.display = "none";
  else if (player.countGhostCollisions === 4) game.heartsArray[1].style.display = "none";
  // CHECK CHEAT CODES
  if (game.cheatString.mistOff === "billy") {
    game.mist.src = "";
  }
  if (game.cheatString.mistOn === "1234") {
    game.mist.src = "images/mist.png";
  }
  // REDRAW
  game.ctx.drawImage(game.background, 0, 0, game.canvasWidth, game.canvasHeight);
  door.print();
  player.print();
  game.ghosts.forEach((ghost) => ghost.print());
  game.ctx.drawImage(game.mist, player.gradX * game.canvasProportion, player.gradY * game.canvasProportion, 1600 * game.canvasProportion, 1200 * game.canvasProportion);
  // CHECK GHOST COLLISIONS (& LOSE CONDITION)
  player.checkGhostCollision();
  // CHECK WIN CONDITION
  door.checkPlayerCollision();
};

function addKeyboardEventListeners() {
  document.body.addEventListener("keydown", (e) => {
    // START GAME
    if (e.key === "Enter") game.newGame();
    // MOVEMENT
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      player.recalculatePosition(0, -20);
      player.direction = "up";
      player.stepCount++;
    }
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      player.recalculatePosition(0, 20);
      player.direction = "down";
      player.stepCount++;
    }
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
      player.recalculatePosition(-20, 0);
      player.direction = "left";
      player.stepCount++;
    }
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
      player.recalculatePosition(20, 0);
      player.direction = "right";
      player.stepCount++;
    }
    // CHEAT CODES
    // mistOff
    if (e.key.toLowerCase() === "b") game.cheatString.mistOff += "b";
    else if (e.key.toLowerCase() === "i") game.cheatString.mistOff += "i";
    else if (e.key.toLowerCase() === "l") game.cheatString.mistOff += "l";
    else if (e.key.toLowerCase() === "y") game.cheatString.mistOff += "y";
    else game.cheatString.mistOff = "";
    // mistOn
    if (e.key === "1") game.cheatString.mistOn += "1";
    else if (e.key === "2") game.cheatString.mistOn += "2";
    else if (e.key === "3") game.cheatString.mistOn += "3";
    else if (e.key === "4") game.cheatString.mistOn += "4";
    else game.cheatString.mistOn = "";
  });
  // STOP MOVEMENT
  document.body.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp" || e.key.toLowerCase() === "w") {
      player.clearAllDirectionTimeoutIds();
      player.movementTimeoutIds.timeoutIdUp = setTimeout(() => {
        player.direction = "standingUp";
      }, 400);
    }
    if (e.key == "ArrowRight" || e.key.toLowerCase() === "d") {
      player.clearAllDirectionTimeoutIds();
      player.movementTimeoutIds.timeoutIdRight = setTimeout(() => {
        player.direction = "standingRight";
      }, 400);
    }
    if (e.key == "ArrowDown" || e.key.toLowerCase() === "s") {
      player.clearAllDirectionTimeoutIds();
      player.movementTimeoutIds.timeoutIdDown = setTimeout(() => {
        player.direction = "standingDown";
      }, 400);
    }
    if (e.key == "ArrowLeft" || e.key.toLowerCase() === "a") {
      player.clearAllDirectionTimeoutIds();
      player.movementTimeoutIds.timeoutIdLeft = setTimeout(() => {
        player.direction = "standingLeft";
      }, 400);
    }
  });
  // RESIZE CANVAS WHEN WINDOW SIZE CHANGES
  window.addEventListener("resize", () => {
    game.canvasWidth = window.innerWidth * 0.6;
    game.canvasHeight = window.innerWidth * 0.6 * 0.75;
    game.canvasProportion = (window.innerWidth * 0.6) / 800;
    game.setCanvasSize();
    if (!game.isStarted) {
      game.ctx.drawImage(game.introduction, 0, 0, game.canvasWidth, game.canvasHeight);
    }
  });
}
