
let animationId = null;

function fly() {
  const elem = document.getElementById("spitfire");
  if (!elem) return;
  
  elem.style.position = 'absolute';
  let angle = 0;
  const centerX = window.innerWidth / 2 - 50;
  const centerY = window.innerHeight / 2 - 50;
  const radiusX = 200;
  const radiusY = 100;
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  function animate() {
    if (angle >= 8 * Math.PI) {
      elem.style.position = '';
      elem.style.top = '';
      elem.style.left = '';
      return;
    }
    
    angle += 0.05;
    const x = centerX + radiusX * Math.sin(angle);
    const y = centerY + radiusY * Math.sin(2 * angle);
    elem.style.left = x + 'px';
    elem.style.top = y + 'px';
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
}

function handlePackageForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const package = formData.get('packages');
  
  if (!package) {
    alert('Selecteer eerst een pakket');
    return;
  }
  
  console.log('Package ordered:', package);
  alert(`Bestelling geplaatst: ${package}`);
}

function handleCustomForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const orderData = {
    grass: formData.get('grass') || 0,
    tiles: formData.get('tiles') || 0,
    hedge: formData.get('hedge') || 0,
    options1: formData.get('options1') || '',
    options2: formData.get('options2') || ''
  };
  
  console.log('Custom quote requested:', orderData);
  alert('Offerte aangevraagd! We nemen spoedig contact op.');
}

document.addEventListener('DOMContentLoaded', () => {
  const packageForm = document.getElementById('packageForm');
  const customForm = document.getElementById('customForm');
  
  if (packageForm) {
    packageForm.addEventListener('submit', handlePackageForm);
  }
  
  if (customForm) {
    customForm.addEventListener('submit', handleCustomForm);
  }
});

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

