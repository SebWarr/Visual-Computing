let img;
let count = 0;
let resolution = 10;
let aliasing = false;
const ALIASING = "antialiasing";
const PERSPECTIVE = "Perspective";
const ORTHOGONAL = "Orthogonal";
const profundidadFocus = -300;
class Square {
 constructor(x, y, width) {
   let point1 = [x, y];
   let point2 = [x, y + width];
   let point3 = [x + width, y + width];
   let point4 = [x + width, y];
   this.points = [point1, point2, point3, point4]
 }
 getPoints() {
   return this.points;
 }
}
function mul(vector, degrees) {
 let matrixRotation = [[Math.cos(Math.PI * degrees / 180), -Math.sin(Math.PI * degrees / 180)],
 [Math.sin(Math.PI * degrees / 180), Math.cos(Math.PI * degrees / 180)]]
 return [vector[0] * matrixRotation[0][0] + vector[1] * matrixRotation[0][1], vector[0] * matrixRotation[1][0] >>+ vector[1] * matrixRotation[1][1], vector[2]]
}
function traceLine(pointA, pointB) {
 beginShape(LINES)
 vertex(pointA[0], pointA[1], pointA[2]);
 vertex(pointB[0], pointB[1], pointB[2]);
 endShape();
}
function tracePoint(point) {
 beginShape(POINTS)
 strokeWeight(10);

 vertex(point[0], point[1], point[2])
 endShape()
}

let projection = PERSPECTIVE;
function setup() {
 createCanvas(720, 540, WEBGL);
 //img=loadImage('/vc/docs/sketches/lenna.png');
 ortho(-width / 2, width / 2, -height / 2, height / 2);
 textureMode(NORMAL);
 sel = createSelect();
 sel.option(PERSPECTIVE);
 sel.option(ORTHOGONAL);
 sel.changed(changeProjection);
 sld = createSlider(10, 40, 10, 10);
 radio = createRadio();
 radio.option(ALIASING);
 radio.option('no' + ALIASING);
 radio.style('width', '20px');

}
function changeProjection() {
 projection = sel.value();

}

function draw() {
 background(255);
 count = (count + 5) % 360;
 cover(true);

 orbitControl();
 resolution = sld.value();
 if (resolution > 20) {
   frameRate(20);
 } else {
   frameRate(40);
 }
 aliasing = (radio.value() == ALIASING);
}

function cover(texture = false) {
 noStroke();
 beginShape();


 let degrees = count;
 let Acoord = [-width / 4, -height / 4, -10];
 Acoord = mul(Acoord, degrees)
 let Bcoord = [width / 4, -height / 4, 80];
 Bcoord = mul(Bcoord, degrees)
 let Ccoord = [-width / 4, height / 4, 0];
 Ccoord = mul(Ccoord, degrees)
 fill(255, 0, 0);
 vertex(Acoord[0], Acoord[1], Acoord[2]);
 fill(0, 255, 0);
 vertex(Bcoord[0], Bcoord[1], Bcoord[2]);

 fill(0, 0, 255);
 vertex(Ccoord[0], Ccoord[1], Ccoord[2]);


 endShape(CLOSE);
 beginShape();
 fill(0);

 baseCoord = [-200, -240]
 ancho = 400
 profundidad = -120
 vertex(baseCoord[0], baseCoord[1], profundidad);
 vertex(baseCoord[0], baseCoord[1] + ancho, profundidad)
 vertex(baseCoord[0] + ancho, baseCoord[1] + ancho, profundidad)
 vertex(baseCoord[0] + ancho, baseCoord[1], profundidad)
 endShape(CLOSE);

 let focus = [(baseCoord[0] * 2 + ancho) / 2, (baseCoord[1] * 2 + ancho) / 2, profundidadFocus]
 beginShape(POINTS);
 vertex(focus[0], focus[1], focus[2]);
 endShape();
 let dVector_A, dVector_B, dVector_C;
 if (projection == PERSPECTIVE) {
   dVector_A = [focus[0] - Acoord[0], focus[1] - Acoord[1], focus[2] - Acoord[2]]
   dVector_B = [focus[0] - Bcoord[0], focus[1] - Bcoord[1], focus[2] - Bcoord[2]]
   dVector_C = [focus[0] - Ccoord[0], focus[1] - Ccoord[1], focus[2] - Ccoord[2]]
 }
 else if (projection == ORTHOGONAL) {
   dVector_A = [0, 0, focus[2] - Acoord[2]]
   dVector_B = [0, 0, focus[2] - Bcoord[2]]
   dVector_C = [0, 0, focus[2] - Ccoord[2]]
 }
 let redFocus = [Acoord[0] + dVector_A[0], Acoord[1] + dVector_A[1], Acoord[2] + dVector_A[2]];
 stroke(255, 0, 0);
 traceLine(Acoord, redFocus);
 let greenFocus = [Bcoord[0] + dVector_B[0], Bcoord[1] + dVector_B[1], Bcoord[2] + dVector_B[2]];
 stroke(0, 255, 0);
 traceLine(Bcoord, greenFocus);
 let blueFocus = [Ccoord[0] + dVector_C[0], Ccoord[1] + dVector_C[1], Ccoord[2] + dVector_C[2]];
 stroke(0, 0, 255);
 traceLine(Ccoord, blueFocus);
 let tA = ((profundidad - Acoord[2]) / dVector_A[2]) - 0.01;
 let redPoint = [Acoord[0] + tA * dVector_A[0], Acoord[1] + tA * dVector_A[1], Acoord[2] + tA * dVector_A[2]]
 stroke(255, 0, 0);
 tracePoint(redPoint);
 let tB = ((profundidad - Bcoord[2]) / dVector_B[2]) - 0.01;
 let greenPoint = [Bcoord[0] + tB * dVector_B[0], Bcoord[1] + tB * dVector_B[1], Bcoord[2] + tB * dVector_B[2]]
 stroke(0, 255, 0);
 tracePoint(greenPoint);
 let tC = ((profundidad - Ccoord[2]) / dVector_C[2]) - 0.01;
 let bluePoint = [Ccoord[0] + tC * dVector_C[0], Ccoord[1] + tC * dVector_C[1], Ccoord[2] + tC * dVector_C[2]]
 stroke(0, 0, 255);
 tracePoint(bluePoint);
 strokeWeight(1);
 beginShape()
 fill(255, 0, 0);
 vertex(redPoint[0], redPoint[1], redPoint[2])
 fill(0, 255, 0);
 vertex(greenPoint[0], greenPoint[1], greenPoint[2])
 fill(0, 0, 255);
 vertex(bluePoint[0], bluePoint[1], bluePoint[2])
 endShape(CLOSE)
 let squares = [];

 let widthGrid = ancho / resolution;

 for (let i = baseCoord[0]; i < baseCoord[0] + ancho; i += widthGrid) {
   for (let j = baseCoord[1]; j < baseCoord[1] + ancho; j += widthGrid) {
     squares.push(new Square(i, j, widthGrid));
   }
 }
 fill(80, 80, 80);
 stroke(0);
 squares.map(sq => {

   beginShape();
   let points = sq.getPoints();
   let barcoord1 = barycentricCoord(points[0], [redPoint[0], redPoint[1]], [greenPoint[0], greenPoint[1]], [bluePoint[0], bluePoint[1]]);
   let barcoord2 = barycentricCoord(points[1], [redPoint[0], redPoint[1]], [greenPoint[0], greenPoint[1]],  [bluePoint[0], bluePoint[1]]);
   let barcoord3 = barycentricCoord(points[2], [redPoint[0], redPoint[1]], [greenPoint[0], greenPoint[1]],  [bluePoint[0], bluePoint[1]]);
   let barcoord4 = barycentricCoord(points[3], [redPoint[0], redPoint[1]], [greenPoint[0], greenPoint[1]], [bluePoint[0], bluePoint[1]]);

   if (!aliasing || !cointained(barcoord1, barcoord2, barcoord3, barcoord4)) {
     let avgPoint = [(points[0][0] + points[2][0]) / 2, (points[0][1] + points[2][1]) / 2];
     let barcoord = barycentricCoord(avgPoint, [redPoint[0], redPoint[1]], [greenPoint[0], greenPoint[1]], [bluePoint[0], bluePoint[1]]);
     fill(255 * barcoord[0], 255 * barcoord[1], 255 * barcoord[2]);
     vertex(points[0][0], points[0][1], profundidad - 0.3);
     vertex(points[1][0], points[1][1], profundidad - 0.3);
     vertex(points[2][0], points[2][1], profundidad - 0.3);
     vertex(points[3][0], points[3][1], profundidad - 0.3);

   } else {

     fill(255 * barcoord1[0], 255 * barcoord1[1], 255 * barcoord1[2]);
     vertex(points[0][0], points[0][1], profundidad - 0.3);
     fill(255 * barcoord2[0], 255 * barcoord2[1], 255 * barcoord2[2]);
     vertex(points[1][0], points[1][1], profundidad - 0.3);
     fill(255 * barcoord3[0], 255 * barcoord3[1], 255 * barcoord3[2]);
     vertex(points[2][0], points[2][1], profundidad - 0.3);
     fill(255 * barcoord4[0], 255 * barcoord4[1], 255 * barcoord4[2]);
     vertex(points[3][0], points[3][1], profundidad - 0.3);
   }

   endShape(CLOSE);
 });


}
function cointained(barCood1, barCood2, barCood3, barCood4) {
 return (barCood1[0] != 1 || barCood1[1] != 1 || barCood1[2] != 1)
   || (barCood2[0] != 1 || barCood2[1] != 1 || barCood2[2] != 1)
   || (barCood3[0] != 1 || barCood3[1] != 1 || barCood3[2] != 1)
   || (barCood4[0] != 1 || barCood4[1] != 1 || barCood4[2] != 1)
}
function barycentricCoord(p, redPoint, greenPoint, bluePoint) {
 let v0;
 let v1, v2;
 if (count >= 90 && count <= 269) {
   v0 = redPoint;
   if ((redPoint[0] > greenPoint[0])) {

     v1 = greenPoint;
     v2 = bluePoint;
   } else {
     v1 = bluePoint;
     v2 = greenPoint;

   }



 } else {
   v0 = greenPoint;
   if (greenPoint[0] > redPoint[0]) {
     v1 = bluePoint;
     v2 = redPoint;
   } else {
     v1 = redPoint;
     v2 = bluePoint;
   }

 }

 let f12 = (v1[1] - v2[1]) * p[0] + (v2[0] - v1[0]) * p[1] + (v1[0] * v2[1] - v1[1] * v2[0]);
 let f20 = (v2[1] - v0[1]) * p[0] + (v0[0] - v2[0]) * p[1] + (v2[0] * v0[1] - v2[1] * v0[0]);
 let f01 = (v0[1] - v1[1]) * p[0] + (v1[0] - v0[0]) * p[1] + (v0[0] * v1[1] - v0[1] * v1[0]);

 if (f12 < 0 || f20 < 0 || f01 < 0) {

   return [1, 1, 1];

 }
 let area = f12 + f20 + f01;
 lambda0 = f12 / area;
 lambda1 = f20 / area;
 lambda2 = f01 / area;
 if (!(redPoint[0] > greenPoint[0])) {
   if (bluePoint == v1) {
     return [lambda2, lambda0, lambda1];
   } else {
     return [lambda1, lambda0, lambda2];
   }
 } else {
   if (v1 == greenPoint) {
     return [lambda0, lambda1, lambda2];
   } else {
     return [lambda0, lambda2, lambda1];
   }
 }


}