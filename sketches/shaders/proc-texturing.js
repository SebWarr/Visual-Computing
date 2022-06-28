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
    pg.shader(pixelShader);
    pg.emitResolution(pixelShader);
    pixelShader.setUniform('u_zoom', 3);
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    texture(pg);

    pg.noStroke();
    pg.textureMode(NORMAL);

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