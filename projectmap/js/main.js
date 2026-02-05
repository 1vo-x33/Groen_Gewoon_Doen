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

function showSection(sectionId) {
  const sections = document.querySelectorAll(".admin-section");

  sections.forEach(section => {
    section.style.display = "none";
  });

  const target = document.getElementById(sectionId);
  if(target) {
    target.style.display = "block";
  }
}

function draw(){
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

