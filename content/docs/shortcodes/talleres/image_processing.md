# Image Processing

{{< p5-global-iframe id="imageProcessing">}}

let lumaShader;
let imgage;
let selector;
let vid;

function preload() {
  lumaShader = readShader('/Visual-Computing/sketches/shaders/lumaImageP.frag', {matrices: Tree.NONE});
  //Fuente: https://www.facebook.com/photo/?fbid=166623455104115&set=a.166623418437452
  imagen = loadImage('/Visual-Computing/sketches/aulas.jpg');
  video = createVideo("/Visual-Computing/sketches/unalbog.mp4",vidLoad);
  video.hide();
}

function setup() {
  
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(lumaShader);
  lumaShader.setUniform('texture', imagen);

  selector = createCheckbox('Iniciar Video',false);
  selector.position(600,10);
  selector.style('color', 'white');  
  selector.changed(SelectorEvent);
  selector2 = createCheckbox('Luma',false);
  selector2.position(600,30);
  selector2.style('color', 'white');  
  selector2.changed(SelectorEvent2);
}

function SelectorEvent(){
  if (selector.checked()) {
    lumaShader.setUniform('texture', video);
    vidLoad();
  } else {
    lumaShader.setUniform('texture', imagen);
  }
}

function SelectorEvent2(){
  if (selector2.checked()) {
    lumaShader.setUniform('filter_selected', 1);
  }else{
     lumaShader.setUniform('filter_selected', 0);
  }
}


function vidLoad() {
  video.loop();
  video.speed(1);
  video.volume(0);
  video.hide();
}

function draw() {
  
  background(0);
  lumaShader.setUniform('mouse_position', [mouseX,mouseY]);
  quad(
  1, 1, -1,
  1, -1, -1,
  1, -1
  );

}

function keyPressed(){
  if(key == 'z'){
    
  }
  background(0);
  lumaShader.setUniform('mouse_position', [mouseX,mouseY]);
  quad(
  1, 1, -1,
  1, -1, -1,
  1, -1
  );
}

{{< /p5-global-iframe >}}