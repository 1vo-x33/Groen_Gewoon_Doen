let id = null;
function fly() {
  let elem = document.getElementById("spitfire");
  elem.style.position = 'absolute';  
  let angle = 0;
  let centerX = window.innerWidth / 2 - 50;
  let centerY = window.innerHeight / 2 - 50;
  let radiusX = 200;
  let radiusY = 100;
  clearInterval(id);
  id = setInterval(frame, 10);
  function frame() {
    if (angle >= 8 * Math.PI) {
        clearInterval(id);
        elem.style.position = '';
        elem.style.top = '';
        elem.style.left = '';
        elem.style.zIndex = '1';
    } else {
      elem.style.position = 'absolute';
      elem.style.zIndex='10';
      angle += 0.05;
      let x = centerX + radiusX * Math.sin(angle);
      let y = centerY + radiusY * Math.sin(2 * angle);
      elem.style.left = x + 'px';
      elem.style.top = y + 'px';
    }
  }
}
let grass = [] 

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  let canvas = document.querySelector('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';
  // Add initial grass
  for (let i = 0; i < 20; i++) {
    grass.push(new Grass(random(width)));
  }
}

function draw(){
    console.log('draw running');
    background(255);  // White background
    for (let g of grass){
        g.show()
        g.update()
    }

    if (grass.length < 50) {
        grass.push(new Grass(random(width)));
    }
}
class Grass{
    constructor(x){
        this.pos = createVector(x, random(-30, 0))
        this.vel = createVector(0, random(7, 10))
        this.len = random(15, 30)
        this.color = color(34, 139, 34);
    }

    show(){
        stroke(this.color)
        strokeWeight(2);
        line(this.pos.x, this.pos.y, this.pos.x, this.pos.y-this.len)
    }
    update(){
        this.pos.add(this.vel)
        if (this.pos.y > height+100){
            grass.shift()
        }
    }
}

