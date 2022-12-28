const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height= 600;


const playerImage = new Image();
playerImage.src ="images/shadow_dog.png";
const spriteWidth =575;//according to my spritesheet(frame of one sprite)
const spriteHeight=523;//"
let frameX = 0;
let frameY = 3;
let gameFrame = 0;
const staggerFrames = 5;
function animate(){
  ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  //ctx.fillRect(x,50,100,100);
  //drow image function
  //ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh) these are the 9 attributes first 4 is to cut our spritesheet next 4 is to place our sprite sheet on canvas
  ctx.drawImage(playerImage, frameX*spriteWidth, frameY* spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
  if (gameFrame% staggerFrames==0){
  if(frameX<8)frameX++;
  else frameX=0;
   }
  gameFrame++;
  requestAnimationFrame(animate)
}
animate();
