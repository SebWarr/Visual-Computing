# 3D Brush

## Introducción

## Resultados


{{< p5-global-iframe sketch="/sketches/trees/3dbrush.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="700" height="600" >}}
  
// Goal in the 3d Brush is double, to implement:
// 1. a gesture parser to deal with depth, i.e.,
// replace the depth slider with something really
// meaningful. You may use a 3d sensor hardware
// such as: https://en.wikipedia.org/wiki/Leap_Motion
// or machine learning software to parse hand (or
// body) gestures from a (video) / image, such as:
// https://ml5js.org/
// 2. other brushes to stylize the 3d brush, taking
// into account its shape and alpha channel, gesture
// speed, etc.

// Brush WiiMote
let control;

// Brush controls

let color;
let depth;
let brush;

let wiimoteX = 300;
let wiimoteY = 225;

let easycam;
let state;

let escorzo;
let points;
let record;
let rotate;
let accelerometro;

function resetPosition(){
  state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 500); // now animate to that state
  escorzo = true;
  perspective();
}

function setup() {
  
  createCanvas(600, 450, WEBGL);
  // easycam stuff
  let state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 2000); // now animate to that state
  escorzo = true;
  perspective();

  // brush stuff
  points = [];
  depth = createSlider(0, 1, 0.01, 0.01);
  depth.id('slider');
  depth.value(0.01);
  depth.position(10, 10);
  depth.style('width', '580px');
  // slider
  depth.hide();
 

  color = '#ffa500';
  
  // select initial brush
  brush = sphereBrush;
  brush = triangleBrush;
}

function draw() {
  captureWiiMote();
  update();
  background('#343a40');
  push();
  strokeWeight(1.5);
  stroke('white');
  grid({ dotted: false });
  pop();
  axes();
  for (const point of points) {
    push();
    translate(point.worldPosition);
    brush(point);
    pop();
  }
}

function captureWiiMote(){
  if(info){
  if(info.HOME === true){
    resetPosition();
    
  }
  if(info.HOME === true && info.MINUS === true){
    points = [];
  }
  if(info.ONE === true){
    record = !record;
    //led(1);
  }
  if(info.MINUS === true && info.PLUS === true){
    accelerometro = !accelerometro;
  }
  /*if(info.TWO === true){
    rotate = !rotate;
  }*/
  if(record){
  
    if(info.DPAD_RIGHT === true){
       wiimoteX += 1;
      }
      if(info.DPAD_LEFT === true){
        wiimoteX -= 1;
      }
      if(info.DPAD_UP === true){
        wiimoteY -= 1;
      }
      if(info.DPAD_DOWN === true){
        wiimoteY += 1;
      }
      if(info.B === true && info.PLUS === true){
        var valor =  parseFloat(document.getElementById('slider').value);
        document.getElementById("slider").value = valor - 0.01;
      }
      if(info.B === true && info.MINUS === true){
        var valor =  parseFloat(document.getElementById('slider').value);
        document.getElementById("slider").value = valor + 0.01;
      }
      let dx = abs(wiimoteX);
      let dy = abs(wiimoteY);
      speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);

        points.push({
          worldPosition: treeLocation([wiimoteX, wiimoteY, depth.value()], { from: 'SCREEN', to: 'WORLD' }),
          color: '#ffa500',
          speed: speed
        });   
    }
    if(info.A === true){
  
    if(info.DPAD_RIGHT === true){
       easycam.rotateY(0.01);
      }
      if(info.DPAD_LEFT === true){
        easycam.rotateY(-0.01);
      }
      if(info.DPAD_UP === true){
        easycam.rotateX(0.01);
        
      }
      if(info.DPAD_DOWN === true){
        easycam.rotateX(-0.01);
      }
      if(info.MINUS === true){
        easycam.zoom(+1);
      }
      if(info.PLUS === true){
        easycam.zoom(-1);
      }
      }
    
    }

    if(accelerometro){
      console.log(accelero);
      easycam.rotateY(accelero.x);
      easycam.rotateX(accelero.y);
      //easycam.zoom(accelero.z);
      console.log("activado");
    }
}


function update() {
  let dx = abs(mouseX);
  let dy = abs(mouseY);
  speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  if (record) {
    points.push({
      worldPosition: treeLocation([mouseX, mouseY, depth.value()], { from: 'SCREEN', to: 'WORLD' }),
      color: '#ffa500',
      speed: speed
    });
  }
}

function sphereBrush(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  sphere(1);
  pop();
}

function triangleBrush(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  triangle(1);
  pop();
}

function keyPressed() {
  if (key === 'r') {
    record = !record;
  }
  if (key === 'p') {
    escorzo = !escorzo;
    escorzo ? perspective() : ortho();
  }
  if (key == 'c') {
    points = [];
  }
}

function mouseWheel(event) {
  //comment to enable page scrolling
  return false;
}


{{< /p5-global-iframe >}}

## Conclusiones

