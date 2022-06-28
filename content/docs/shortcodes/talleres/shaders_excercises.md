# Shaders

## UV Visualization

{{< details title="uv.js" open=false >}}
```js
let uvShader;

function preload() {
  // Define geometry directly in clip space (i.e., matrices: Tree.NONE).
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/Visual-Computing/sketches/shaders/uv.frag', { matrices: Tree.NONE, varyings: Tree.texcoords2 });
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);
  noStroke();
  // see: https://p5js.org/reference/#/p5/shader
  shader(uvShader);
  // https://p5js.org/reference/#/p5/textureMode
  // best and simplest is to just always used NORMAL
  textureMode(NORMAL);
}

function draw() {
  background(0);
  // clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  // https://p5js.org/reference/#/p5/quad
  // It's worth noting (not mentioned in the api docs) that the quad
  // command also adds the texture coordinates to each of its vertices.
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
  ellipse(0, 2, 0);
  triangle(2, 2, -2, -2, 3, 3);
}
```
{{< /details >}}
{{< details title="uv.frag" open=false >}}
```frag
precision mediump float;

// the texture coordinates varying was defined in 
// the vertex shader by treegl readShader()
// open your console and & see!
varying vec2 texcoords2;

void main() {
  // glsl swizzling is both handy and elegant
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  gl_FragColor = vec4(1.0-texcoords2.x,0.0,texcoords2.y, 1.0);
}
```
{{< /details >}}


{{< p5-global-iframe id="breath" width="400" height="400">}}
let uvShader;

function preload() {
  // Define geometry directly in clip space (i.e., matrices: Tree.NONE).
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/Visual-Computing/sketches/shaders/uv.frag', { matrices: Tree.NONE, varyings: Tree.texcoords2 });
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);
  noStroke();
  // see: https://p5js.org/reference/#/p5/shader
  shader(uvShader);
  // https://p5js.org/reference/#/p5/textureMode
  // best and simplest is to just always used NORMAL
  textureMode(NORMAL);
}

function draw() {
  background(0);
  // clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  // https://p5js.org/reference/#/p5/quad
  // It's worth noting (not mentioned in the api docs) that the quad
  // command also adds the texture coordinates to each of its vertices.
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
  ellipse(0, 2, 0);
  triangle(2, 2, -2, -2, 3, 3);
}

{{< /p5-global-iframe >}}

## Texture sampling

{{< details title="luma.js" open=false >}}
```js
let lumaShader;
let img;
let grey_scale;
let HSL_effect;
let HSV_effect;

let myFont;

function preload() {
  lumaShader = readShader('/Visual-Computing/sketches/shaders/luma.frag', { varyings: Tree.texcoords2 });
  // image source: https://i.pinimg.com/736x/09/83/1f/09831fcddd633566d10508b171b69441--wolf-wallpaper-animal-wallpaper.jpg
  img = loadImage('/Visual-Computing/sketches/shaders/wolf.jpg');
  arial = loadFont('/Visual-Computing/sketches/arial.ttf');
}

function setup() {
  
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(lumaShader);

  grey_scale = createCheckbox('Luma effect', false);
  grey_scale.position(10, 10);
  grey_scale.style('color', 'white');
  grey_scale.input(() => lumaShader.setUniform('grey_scale', grey_scale.checked()));
  lumaShader.setUniform('texture', img);

  //HSL
  HSL_effect = createCheckbox('HSL effect', false);
  HSL_effect.position(10, 30);
  HSL_effect.style('color', 'white');
  HSL_effect.input(() => lumaShader.setUniform('HSL_effect', HSL_effect.checked()));
  lumaShader.setUniform('texture', img);

  //HSV
  HSV_effect = createCheckbox('HSV effect', false);
  HSV_effect.position(130, 11);
  HSV_effect.style('color', 'white');
  HSV_effect.input(() => lumaShader.setUniform('HSV_effect', HSV_effect.checked()));
  lumaShader.setUniform('texture', img);
}

function draw() {
  textFont(arial);
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}
```
{{< /details >}}

{{< details title="luma.frag" open=false >}}
```frag
precision mediump float;

// uniforms are defined and sent by the sketch
uniform bool grey_scale;
uniform bool HSL_effect;
uniform bool HSV_effect;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

// returns luma of given texel
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

//HSV of given texel
float HSV(vec3 texel) {
  float r = texel.r;
  float g = texel.g;
  float b = texel.b;
  
  float Cmax = max(r,max(g,b)); 

  float V = Cmax;
  return V; 
}

//HSL of given texel
float HSL(vec3 texel) {
  float r = texel.r;
  float g = texel.g;
  float b = texel.b;
  
  float Cmax = max(r,max(g,b)); 
  float Cmin = min(r,min(g,b));

  float L = (Cmax + Cmin) / 2.0;
  return L; 
}

void main() {
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);

  if (grey_scale == true){
    gl_FragColor = vec4((vec3(luma(texel.rgb))), 1.0);
  }
  else if(HSV_effect == true){
    gl_FragColor = vec4(vec3(HSV(texel.rgb)), 1.0);
  }
  else if(HSL_effect == true){
    gl_FragColor = vec4(vec3(HSL(texel.rgb)), 1.0);
  }
  else{
    gl_FragColor = texel;
  }
}
```
{{< /details >}}

{{< p5-global-iframe id="breath" width="700" height="600">}}
let lumaShader;
let img;
let grey_scale;
let HSL_effect;
let HSV_effect;

let myFont;

function preload() {
  lumaShader = readShader('/Visual-Computing/sketches/shaders/luma.frag', { varyings: Tree.texcoords2 });
  img = loadImage('/Visual-Computing/sketches/shaders/wolf.jpg');
  arial = loadFont('/Visual-Computing/sketches/arial.ttf');
}

function setup() {
  
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(lumaShader);

  grey_scale = createCheckbox('Luma effect', false);
  grey_scale.position(10, 10);
  grey_scale.style('color', 'white');
  grey_scale.input(() => lumaShader.setUniform('grey_scale', grey_scale.checked()));
  lumaShader.setUniform('texture', img);

  //HSL
  HSL_effect = createCheckbox('HSL effect', false);
  HSL_effect.position(10, 30);
  HSL_effect.style('color', 'white');
  HSL_effect.input(() => lumaShader.setUniform('HSL_effect', HSL_effect.checked()));
  lumaShader.setUniform('texture', img);

  //HSV
  HSV_effect = createCheckbox('HSV effect', false);
  HSV_effect.position(130, 11);
  HSV_effect.style('color', 'white');
  HSV_effect.input(() => lumaShader.setUniform('HSV_effect', HSV_effect.checked()));
  lumaShader.setUniform('texture', img);
}

function draw() {
  textFont(arial);
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}

{{< /p5-global-iframe >}}

## Image processing

{{< details title="lumaImageP.frag" open=false >}}
```frag
precision mediump float;

uniform bool grey_scale;
uniform sampler2D texture;
uniform vec2 mouse_position;
uniform float filter_selected;
uniform vec2 u_resolution;

varying vec2 texcoords2;

vec3 lumaFunction() {

  vec4 color = texture2D(texture, texcoords2);
  
  vec2 st = gl_FragCoord.xy; 
  vec2 mouse = vec2(mouse_position.x, 500.0 - mouse_position.y);

  if(distance(st,mouse)< 150.0){
    vec4 color = texture2D(texture, vec2((1.0- mouse.x/700.0) + (texcoords2.x - mouse.x/700.0)*0.3,(1.0- mouse.y/500.0) + (texcoords2.y - mouse.y/500.0)*0.3));
    float r = color.r;
    float g = color.g;
    float b = color.b;

    float V;
     
    if (filter_selected == 1.0){
      V = dot(color.rgb, vec3(0.5,0.5,0.1));
    }

    vec3 result = vec3(V);
    if (filter_selected == 1.0){
     
    }else{
      result.r = r;
      result.g = g;
      result.b = b;
    }

    
    return result;

  }else{

    vec4 color = texture2D(texture, texcoords2);

    float r = color.r;
    float g = color.g;
    float b = color.b;

    return (vec3(r,g,b));
  }

}

void main() {

  gl_FragColor = vec4(lumaFunction(), 1.0);

}
```
{{< /details >}}

{{< details title="lumaImageP.js" open=false >}}
```js
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

```
{{< /details >}}


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

## Procedural texturing

{{< details title="proc-texturing.js" open=false >}}
```js
let pg;
let truchetShader;

function preload() {
    pixelShader = readShader('/Visual-Computing/sketches/shaders/pixelShader.frag', { matrices: Tree.NONE, varyings: Tree.NONE});
}

function setup() {
    createCanvas(380, 380, WEBGL);
    pg = createGraphics(380, 380, WEBGL);
    textureMode(NORMAL);
    noStroke();


    // Shader
    selShader = createSelect();
    selShader.changed(changeShader);

    pg.noStroke();
    pg.textureMode(NORMAL);

    let val = selShader.value();

    pg.shader(pixelShader);
    pg.emitResolution(pixelShader);
    pixelShader.setUniform('u_zoom', 3);

    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    texture(pg);

}

function draw() {
    orbitControl();
    background('#222222');
    let shape = torus(90, 45);  
}

function changeShader(){
    pg.shader(pixelShader);
    pg.emitResolution(pixelShader);
    pixelShader.setUniform('u_zoom', 3);
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    texture(pg);
}
```
{{< /details >}}

{{< p5-iframe sketch="/Visual-Computing/sketches/shaders/proc-texturing.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" width="410" height="430" >}}
