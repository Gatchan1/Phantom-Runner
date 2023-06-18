let canvasB = document.getElementById("canvasBack");
let ctxB = canvasB.getContext("2d");
/* let canvasF = document.getElementById("canvasFront");
let ctxF = canvasF.getContext("2d"); */

let intro = document.createElement("img");
intro.src = "./images/intro.png";

window.onload = () => {
  ctxB.drawImage(intro, 0, 0, 800, 600);
};

let playerSprite = document.createElement("img");
playerSprite.src = "./images/BILLY_BIT.png";

let background = document.createElement("img");
background.src = "./images/canvas-background.png"; //"./images/main-background.png"

let gradient = document.createElement("img");
gradient.src = "images/LAYER2.png";

let ghostSprite = document.createElement("img");
ghostSprite.src = "./images/ghost1.png";

let gameOverImg = document.createElement("img");
gameOverImg.src = "./images/gameover.png";

let gameWinImg = document.createElement("img");
gameWinImg.src = "./images/youdidit.png";

let exitDoorUp = document.createElement("img");
exitDoorUp.src = "./images/EXIT.png";
let exitDoorDown = document.createElement("img");
exitDoorDown.src = "./images/Puerta-Abajo.png";
let exitDoorLeft = document.createElement("img");
exitDoorLeft.src = "./images/Puerta-Izq.png";
let exitDoorRight = document.createElement("img");
exitDoorRight.src = "./images/Puerta-Derecha.png";

//Esto es de cuando usábamos dos canvas:
/* ctxF.fillStyle = "black";
ctxF.fillRect(0,0,800,600);


// ctxF.fillStyle = "black";
// ctxF.fillRect(0,0,800,600);

// ctxF.save(); */

// HEARTS DISPLAY
let hearts = document.createElement("img");
document.querySelector("#heart-icon").appendChild(hearts);
document.querySelector("#heart-icon>img").classList.add("heart-life");

const player = {
  // Initial positions:
  x: 401,
  y: 290,
  w: 18,
  h: 23,
  // arcX: 410,
  // arcY: 310,
  gradX: -393, //355,
  gradY: -295, //255,
  countGhostCollisions: 0,

  //Initial direction:
  direction: "standingDown",

  spritePositions: {
    //BILLY_BIT.png
    standingUp: { x_ini: 0, y_ini: 48 },
    up: [
      { x_ini: 16, y_ini: 48 },
      { x_ini: 32, y_ini: 48 },
    ],
    //{x_ini: 510, y_ini: 0},
    standingRight: { x_ini: 0, y_ini: 32 },
    right: [
      // {x_ini: 100, y_ini: 0},{x_ini: 200, y_ini: 0}
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

  checkGhostCollision: function () {
    for (let i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (isColliding(this, ghost)) {
        this.countGhostCollisions++;
        if (this.countGhostCollisions < 5) {
          this.x = 401;
          this.y = 290;
          this.gradX = -393;
          this.gradY = -295;
        } else {
          gameOver();
        }
      }
    }
  },

  recalculatePosition: function (incX, incY) {
    let newX = this.x + incX;
    let newY = this.y + incY;

    if (canMoveTo(newX, newY, this.w, this.h)) {
      if (newX >= 0 && newX <= canvasB.width - 18) {
        // 18 is the player's width
        this.x = newX;
        // this.arcX += incX;
        this.gradX += incX;
      }

      if (newY >= 0 && newY <= canvasB.height - 23) {
        // 23 is the player's height
        this.y = newY;
        // this.arcY += incY;
        this.gradY += incY;
      }
    }
  },

  print: function () {
    // ctxB.fillStyle = "red";
    // ctxB.fillRect(this.x,this.y,this.w,this.h);

    if (this.direction == "standingUp") {
      ctxB.drawImage(playerSprite, this.spritePositions.standingUp.x_ini, this.spritePositions.standingUp.y_ini, 12, 16, this.x, this.y, this.w, this.h);
    }
    if (this.direction == "standingRight") {
      ctxB.drawImage(playerSprite, this.spritePositions.standingRight.x_ini, this.spritePositions.standingRight.y_ini, /* 100, 100 */ 12, 16, this.x, this.y, this.w, this.h);
    }
    if (this.direction == "standingDown") {
      ctxB.drawImage(playerSprite, this.spritePositions.standingDown.x_ini, this.spritePositions.standingDown.y_ini, 12, 16, this.x, this.y, this.w, this.h);
    }
    if (this.direction == "standingLeft") {
      ctxB.drawImage(playerSprite, this.spritePositions.standingLeft.x_ini, this.spritePositions.standingLeft.y_ini, 12, 16, this.x, this.y, this.w, this.h);
    }
    if (this.direction == "up") {
      if (iWalk % 2 == 0) {
        ctxB.drawImage(playerSprite, this.spritePositions.up[0].x_ini, this.spritePositions.up[0].y_ini, 12, 16, this.x, this.y, this.w, this.h);
      } else {
        ctxB.drawImage(playerSprite, this.spritePositions.up[1].x_ini, this.spritePositions.up[1].y_ini, 12, 16, this.x, this.y, this.w, this.h);
      }
    }
    if (this.direction == "right") {
      if (iWalk % 2 == 0) {
        ctxB.drawImage(playerSprite, this.spritePositions.right[0].x_ini, this.spritePositions.right[0].y_ini, /* 100, 100 */ 12, 16, this.x, this.y, this.w, this.h);
      } else {
        ctxB.drawImage(playerSprite, this.spritePositions.right[1].x_ini, this.spritePositions.right[1].y_ini, /* 100, 100 */ 12, 16, this.x, this.y, this.w, this.h);
      }
    }
    if (this.direction == "down") {
      if (iWalk % 2 == 0) {
        ctxB.drawImage(playerSprite, this.spritePositions.down[0].x_ini, this.spritePositions.down[0].y_ini, 12, 16, this.x, this.y, this.w, this.h);
      } else {
        ctxB.drawImage(playerSprite, this.spritePositions.down[1].x_ini, this.spritePositions.down[1].y_ini, 12, 16, this.x, this.y, this.w, this.h);
      }
    }
    if (this.direction == "left") {
      if (iWalk % 2 == 0) {
        ctxB.drawImage(playerSprite, this.spritePositions.left[0].x_ini, this.spritePositions.left[0].y_ini, 12, 16, this.x, this.y, this.w, this.h);
      } else {
        ctxB.drawImage(playerSprite, this.spritePositions.left[1].x_ini, this.spritePositions.left[1].y_ini, 12, 16, this.x, this.y, this.w, this.h);
      }
    }
  },
};

//COLLISION WITH OBSTACLES

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
}

function canMoveTo(newX, newY, playerWidth, playerHeight) {
  const playerRect = {
    x: newX,
    y: newY,
    w: playerWidth,
    h: playerHeight,
  };

  for (const obstacle of obstacles) {
    if (isColliding(playerRect, obstacle)) {
      return false;
    }
  }

  return true;
}

let ghosts = [];

class Ghost {
  constructor() {
    this.x = 200;
    this.y = 200;
    this.w = 18;
    this.h = 23;
    this.speedX = 2; // horizontal movement speed
    this.speedY = 1; // vertical movement speed
  }
  print() {
    // Update ghost position based on its speed
    this.x += this.speedX;
    this.y += this.speedY;
    // Draw ghost image at new position
    ctxB.drawImage(ghostSprite, this.x, this.y, this.w, this.h);
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
//initial ghosts
for (let i = 0; i < 3; i++) {
  ghosts.push(new GhostTop());
  ghosts.push(new GhostRight());
  ghosts.push(new GhostBottom());
  ghosts.push(new GhostLeft());
  ghosts.push(new GhostRightMidway());
  ghosts.push(new GhostLeftMidway());
}

///////////////////////////////
/////////// INTERVAL //////////
let countUpdate = 0;
const update = function () {
  countUpdate++;

  //CLEAN
  // ctxF.restore()
  ctxB.clearRect(0, 0, 800, 600);
  // ctxF.clearRect(0,0,800,600);

  //GENERATE GHOSTS
  if (countUpdate % 35 == 0) {
    let ghostTop = new GhostTop();
    let ghostLeft = new GhostLeft();
    let ghostRight = new GhostRight();
    let ghostBottom = new GhostBottom();
    ghosts.push(ghostTop);
    ghosts.push(ghostLeft);
    ghosts.push(ghostRight);
    ghosts.push(ghostBottom);
  }

  //CHECK LIFE
  if (player.countGhostCollisions == 0) {
    hearts.src = "images/life-5.png";
  } else if (player.countGhostCollisions == 1) {
    hearts.src = "images/life-4.png";
  } else if (player.countGhostCollisions == 2) {
    hearts.src = "images/life-3.png";
  } else if (player.countGhostCollisions == 3) {
    hearts.src = "images/life-2.png";
  } else {
    hearts.src = "images/life-1.png";
  }

  //REDRAW
  ctxB.drawImage(background, 0, 0, 800, 600);

  drawDoor();

  player.print();
  ghosts.forEach((ghost) => {
    ghost.print();
  });

  ctxB.drawImage(gradient, player.gradX, player.gradY, 1600, 1200);

  player.checkGhostCollision();
  checkExitCollision();

  if (cheatString == "billy") {
    gradient.src = "";
  }

  if (gradientBack == "1234") {
    gradient.src = "images/LAYER2.png";
  }
};
///////////////////////////////
///////////////////////////////

let intervalId = null;

let hasStarted = false;
let start = function () {
  if (!hasStarted) {
    hasStarted = true;
    intervalId = setInterval(update, 60);
    player.x = 401;
    player.y = 290;
    player.w = 18;
    player.h = 23;
    // arcX = 410;
    // arcY = 310;
    player.gradX = -393; //355;
    player.gradY = -295; //255;
    player.countGhostCollisions = 0;
    player.direction = "standingDown";
    ghosts = [];
    for (let i = 0; i < 3; i++) {
      ghosts.push(new GhostTop());
      ghosts.push(new GhostRight());
      ghosts.push(new GhostBottom());
      ghosts.push(new GhostLeft());
      ghosts.push(new GhostRightMidway());
      ghosts.push(new GhostLeftMidway());
    }
    chooseBorderDirection();
    chooseDoorPosition();
    console.log("borderDirection", borderDirection);
    console.log("doorX and doorY:", door.x, door.y);
  }
};

document.getElementById("play-button").addEventListener("click", start);

function gameOver() {
  ctxB.drawImage(gameOverImg, 50, 105, 700, 445);
  clearInterval(intervalId);
  hasStarted = false;
}

function gameWin() {
  ctxB.drawImage(gameWinImg, 100, 0, 600, 600);
  clearInterval(intervalId);
  hasStarted = false;
}

//////////// MOVEMENT ////////////
let timeoutIdUp;
let timeoutIdRight;
let timeoutIdDown;
let timeoutIdLeft;
let iWalk = 0;

function clearAllDirectionTimeoutIds() {
  clearTimeout(timeoutIdUp);
  clearTimeout(timeoutIdRight);
  clearTimeout(timeoutIdDown);
  clearTimeout(timeoutIdLeft);
}

document.body.addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
    player.recalculatePosition(0, -20);
    player.direction = "up";
    iWalk++;
    clearAllDirectionTimeoutIds();
  }
  if (e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
    player.recalculatePosition(0, 20);
    player.direction = "down";
    iWalk++;
    clearAllDirectionTimeoutIds();
  }
  if (e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
    player.recalculatePosition(-20, 0);
    player.direction = "left";
    iWalk++;
    clearAllDirectionTimeoutIds();
  }
  if (e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
    player.recalculatePosition(20, 0);
    player.direction = "right";
    iWalk++;
    clearAllDirectionTimeoutIds();
  }
});

document.body.addEventListener("keyup", (e) => {
  if (e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
    timeoutIdUp = setTimeout(() => {
      player.direction = "standingUp";
    }, 400);
  }
  if (e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
    timeoutIdRight = setTimeout(() => {
      player.direction = "standingRight";
    }, 400);
  }
  if (e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
    timeoutIdDown = setTimeout(() => {
      player.direction = "standingDown";
    }, 400);
  }
  if (e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
    timeoutIdLeft = setTimeout(() => {
      player.direction = "standingLeft";
    }, 400);
  }
});


//////////// RANDOMLY PLACED EXIT ///////////
// Define the rectangles with their respective coordinates
const borderUp = [ // y = 15
  { initX: 6, endX: 180}, 
  { initX: 259, endX: 755},
];
const borderRight = [ // x = 771
  { initY: 30, endY: 145 },
  { initY: 226, endY: 390 },
  { initY: 476, endY: 560 },
];
const borderDown = [ // y = 572
  { initX: 6, endX: 370 },
  { initX: 432, endX: 765 },
];
const borderLeft = [ // x = -15
  { initY: 30, endY: 348 },
  { initY: 428, endY: 560 },
];

// I want the chance of the door being in one border of the canvas proportional to the available space in pixels.
// First I sum the pixels each border has available:

// console.log("sum upper border pixels: ", (borderUp[0].endX - borderUp[0].initX) + (borderUp[1].endX - borderUp[1].initX)) // 670
// console.log("sum right border pixels: ", (borderRight[0].endY - borderRight[0].initY) + (borderRight[1].endY - borderRight[1].initY) + (borderRight[2].endY - borderRight[2].initY)) // 363 + 670 = 1033
// console.log("sum bottom border pixels: ", (borderDown[0].endX - borderDown[0].initX) + (borderDown[1].endX - borderDown[1].initX)) // 697 + 1033 = 1730
// console.log("sum left border pixels: ", (borderLeft[0].endY - borderLeft[0].initY) + (borderLeft[1].endY - borderLeft[1].initY)) // 450 + 1730 = 2180

// Randomly determine the direction where the door will be set, taking into account the available space in pixels:
let borderDirection;
function chooseBorderDirection() {
  const chancesAccordingToBorderSize = Math.floor(Math.random() * 2180);
  if (chancesAccordingToBorderSize < 670) {
    borderDirection = "up";
    return;
  } else if (chancesAccordingToBorderSize < 1033) {
    borderDirection = "right";
    return;
  } else if (chancesAccordingToBorderSize < 1730) {
    borderDirection = "down";
    return;
  } else if (chancesAccordingToBorderSize < 2180) {
    borderDirection = "left";
    return;
  }
}

// Function to generate a random number within a range
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const door = { w: 40, h: 40 };
let narrowToOneDoor;
let possibilities = [];
let drawDoor;

// Generic function to determine possible places for a door to be, within one border of the canvas.
function chooseBorder(possibilitiesArray, direction) {
  possibilitiesArray = [];
  for (let i = 0; i < direction.length; i++) {
    const fragment = direction[i];
    let randomX
    let randomY
    // If it's a horizontal border:
    if (fragment.initX) {
      randomX = getRandom(fragment.initX, fragment.endX);
    }
    // If it's a vertical border:
    if (fragment.initY) {
      randomY = getRandom(fragment.initY, fragment.endY);
    }
    possibilitiesArray.push({ randomX, randomY });
  }
  narrowToOneDoor = possibilitiesArray[Math.floor(Math.random() * possibilitiesArray.length)];
  console.log("doorPosition:", narrowToOneDoor);
  if (narrowToOneDoor.randomX) {door.x = narrowToOneDoor.randomX};
  if (narrowToOneDoor.randomY) {door.y = narrowToOneDoor.randomY};
  console.log("door:", door);
}

function chooseDoorPosition() {
  if (borderDirection == "up") {
    chooseBorder(possibilities, borderUp);
    door.h = 42;
    door.y = 15
    drawDoor = () => ctxB.drawImage(exitDoorUp, door.x, door.y, door.w, door.h);
  } else if (borderDirection == "right") {
    chooseBorder(possibilities, borderRight);
    door.x = 771
    drawDoor = () => ctxB.drawImage(exitDoorRight, door.x, door.y, door.w, door.h);
  } else if (borderDirection == "down") {
    chooseBorder(possibilities, borderDown);
    door.y = 572
    drawDoor = () => ctxB.drawImage(exitDoorDown, door.x, door.y, door.w, door.h);
  } else if (borderDirection == "left") {
    chooseBorder(possibilities, borderLeft);
    door.x = -15
    drawDoor = () => ctxB.drawImage(exitDoorLeft, door.x, door.y, door.w, door.h);
  }
}


function checkExitCollision() {
  if (isColliding(player, door)) {
    gameWin();
  }
}


// CHEAT CODES
let cheatString = "";
document.body.addEventListener("keydown", (e) => {
  if (e.key == "b" || e.key == "B") {
    cheatString += "b";
  } else if (e.key == "i" || e.key == "I") {
    cheatString += "i";
  } else if (e.key == "l" || e.key == "L") {
    cheatString += "l";
  } else if (e.key == "y" || e.key == "Y") {
    cheatString += "y";
    // console.log("cheatString", cheatString)
  } else {
    cheatString = "";
  }
});

let gradientBack = "";
document.body.addEventListener("keydown", (e) => {
  if (e.key == "1") {
    gradientBack += "1";
  } else if (e.key == "2") {
    gradientBack += "2";
  } else if (e.key == "3") {
    gradientBack += "3";
  } else if (e.key == "4") {
    gradientBack += "4";
  } else {
    gradientBack = "";
  }
});
