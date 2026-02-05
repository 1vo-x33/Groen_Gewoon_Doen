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
// let grass = [] 

// function setup(){
//   createCanvas(windows.innerHeight, windows.innerWidth);
// }

// function draw(){
//     background(30);
//     for (let g of rains){
//         g.show()
//         g.update()
//         g.checkMouse(); //Fix this
//     }

//     for (let i =0; i < 10; i++){
//         grass.push(new Grass(random(width)))
//     }

//     print(grass.length)
// }
// class Grass{
//     constructor(x, y){
//         this.pos = createVector(x, y)
//         this.vel = createVector(0, random(7, 10))
//         this.len = random(15, 30)
//         this.thick = random(255)
//         this.color = color(34, 139, 34);
//     }

//     show(){
//         stroke(this.color, this.thick)
//         line(this.pos.x, this.pos.y, this.pos.x, this.pos.y-this.len)
//     }
//     update(){
//         this.pos.add(this.vel)
//         if (this.pos.y > height+100){
//             grass.shift()
//         }
//     }
//     checkMouse() {
//         let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
//         if (d < 50) { // Repel if within 50 pixels
//             let repel = p5.Vector.sub(this.pos, createVector(mouseX, mouseY));
//             repel.setMag(5); // Strength of the repelling force
//             this.pos.add(repel);
//         }
//     }
// }

