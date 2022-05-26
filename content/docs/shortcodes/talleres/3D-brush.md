# 3D Brush

## Introducción

En esta implementación de el Pincel en 3D (3D Brush), se utiliza un control remoto de un Nintendo Wii (Wiimote) para el control del dibujo y movimiento del plano. Esto se suma al uso de TreeGL y EasyCAM.

## El Control Remoto

![3dbrush1](https://i.blogs.es/8ba955/fundawii/450_1000.jpg)

El Wiimote es el control remoto de la Consola Nintendo Wii (2006 - 2017); utiliza tecnología Bluetooth para la conexión con el Wii y con otros dispositivos. Está construido sobre el SOC Broadcom BCM2042. A pesar de utilizar las interfaces estandar USB HID no utiliza los descriptores ni tipos de datos estandar por lo que son necesarios drivers o programas especializados para la conexión.

### La conexión; Wiimote for the Web

En esta oportunidad se ha optado por utilizar la librería WiiMote for the Web, que se basa en la tecnología WebHID. WebHID aún se considera una tecnología de caracter experimental por lo que es necesario habilitarla para el uso en los navegadores soportados (basados en Chromium).

La librería combina el uso de WebHID y JavaScript para generar una interface que permite hacer uso de prácticamente todas las funcionalidades del WiiMote (bluetooth, botones, LEDs, vibración, infrarrojo, etc.).

### Integración

La librería nos entregará un arreglo con todos los botones y en caso de que alguno de ellos sea oprimido el elemento cambiará del valor "false" al valor "true". Adicionalmente, también nos entregará los datos del acelerómetro integrado del control y funcionalidades para activar o desactivar los LED y el vibrador interno.

Es de resaltar que el Wiimote es un senson de infrarrojo en si mismo y la barra inicialmente incluida en los Wii únicamente cumplia la funcionalidad de contar con infrarrojos para que el control la viera.

![3dbrush2](https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Nintendo_Wii_Sensor_Bar.jpg/640px-Nintendo_Wii_Sensor_Bar.jpg)

El principal reto en la implementación fue la integración de la librería con la interface de p5js y la normalización de los valores de algunos inputs para obtener la funcionalidad deseada.

## Resultados / Implementación.


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
let selectBrush;

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
  
  
}

function draw() {
  if(selectBrush){brush = cubeBrush;}else{brush = sphereBrush;}
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
  if(info.TWO === true){
    selectBrush = !selectBrush;
  }
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

function cubeBrush(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  box(1);
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

## Apreciaciones y Conclusiones

Lo más interesante fue ver la funcionalidad que aún presenta un dispositivo tan antiguo para los estandares de hoy como lo es el Wiimote; apesar de tener más de 15 años en el mercado, cuenta con funcionalidades bastante especiales que en su momento le hicieron un dispositivo único y posicionaron a la Wii consola más vendida en la historia de Nintendo.

Muy importantes tambien son las funcionalidades que aún puede tener un dispositivo como este; el sensor de infrarrojos abre todo tipo de posibilidades para la interacción con espacios en 3D. Esta es una funcionalidad que podría ser implementada en una nueva iteración.

Es importante mencionar que la librería p5.EasyCam contó con una gran facilidad de utilización y fue de facil implementación. A pesar de eso, mostró lo poderosa que puede llegar a ser en el manejo de espacios 3D al contar con funcionalidades como sobreo e iluminación avanzada.

Finalmente, se quiere mencionar el uso de una tecnología experimental como lo es WebHID; cuando esta tecnología logre ser adoptada de manera más amplia se abrirá la puerta a que los navegadores puedan acceder directamente a dispositivos de hardware (contoles, simuladores, dispositivos médicos, etc) sin la necesidad de drivers o modificaciones por parte de los usuarios. Desafortunadamente la única implementación actual de esta tecnología se encuentra en los navegadores basados en Chromium.

## Referencias y consulta avanzada.

- [Kevin Picchi, Wiimote for the Web](https://github.com/PicchiKevin/wiimote-webhid)
- [W3C Community Group Draft Report - WebHID API (Marzo de 2022)](https://wicg.github.io/webhid/)
- [p5.js - Referencia](https://p5js.org/es/reference/)
- [James William Dunn - Referencia p5.EasyCam](https://github.com/freshfork/p5.EasyCam)
- [Hugo References](https://gohugo.io/functions/)
- [Wiimote - Wikipedia, la enciclopedia libre](https://es.wikipedia.org/wiki/Wiimote)