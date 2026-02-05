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
    } else {
      angle += 0.05;
      let x = centerX + radiusX * Math.sin(angle);
      let y = centerY + radiusY * Math.sin(2 * angle);
      elem.style.left = x + 'px';
      elem.style.top = y + 'px';
    }
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

