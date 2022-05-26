# Rasterización

## Introducción

La técnica de renderizado por rasterización es, con cierta certeza, la técnica más popular para producir gráficos de computadora en 3D en tiempo real, sin embargo, es probablemente la técnica que menos se entiende y menos se documentada de todas las demás familiarizadas, en especial si se pone a discusión, la técnica de ray-tracing.

Dicha "segregación" se debe a varios factores, por ejemplo, la rasterización es una "técnica del pasado", pero para nada una técnica obsoleta ya que las técnicas utilizadas para producir una imagen implementando este algoritmo tomaron fuerza entre los años 60 y principios de los 80. La rasterización es también la técnica utilizada por las GPU para producir gráficos en 3D y en comparación con otros métodos de renderizado (como ray-tracing), la rasterización es extremadamente rápida.

La rasterización, nuestra técnica a conocer, se encarga de transformar una imagen de un formato de gráficos vectoriales a una imagen rasterizada (imagen compuesta por píxeles y puntos) para su salida en un monitor, impresora o almacenamiento (con formato de archivo de mapa de bits). 

![raster1](https://answers.unity.com/storage/temp/153868-bitmap.png)

## Antecedentes

El origen de la rasterización de imágenes se remonta a los primeros días de la tecnología de la televisión. A mediados del siglo XX, los televisores generalmente consistían en monitores de tubo de rayos catódicos (CRT), que escaneaban líneas en sus pantallas que se acumulaban gradualmente en imágenes completas. Los monitores CRT permanecieron entre el hardware de visualización electrónica más común durante el resto del siglo, pero las computadoras convencionales no los usaron de manera normal hasta las décadas de 1980 y 1990.

![raster2](https://clagos2008.files.wordpress.com/2012/11/crt.jpg)

Los gráficos rasterizados a menudo se comparan con los vectores de imagen. Si bien la rasterización suele ser un proceso de compilación de líneas de escaneo o píxeles en un mapa de bits, los vectores incorporan funciones matemáticas para crear imágenes basadas en formas geométricas, ángulos y curvas.

A lo largo de los primeros años de los gráficos por computadora en la década de los 70s, los problemas más importantes a resolver fueron cuestiones fundamentales como los algoritmos de visibilidad y las representaciones geométricas. Cuando 1 MB de RAM era un lujo costoso y bastante escaso,  la complejidad de lo que era posible en los gráficos por computadora era correspondientemente limitada y cualquier intento de simular la física para renderizar era muy poco factible.

La simple declaración de Jim Blinn ("a medida que avanza la tecnología, el tiempo de renderizado permanece constante") detalla una restricción importante: dada una cantidad de imágenes que se deben renderizar, solo es posible tomar cierto tiempo de procesamiento para cada uno. Uno tiene una cierta cantidad de cómputo disponible y otro tiene una cierta cantidad de tiempo disponible antes de que se deba terminar el renderizado, por lo que el cómputo máximo por imagen está necesariamente limitado.

## Conceptos clave

### Proyección ortográfica

Forma de representación de objetos tridimensionales en dos dimensiones. Es una forma de proyección paralela, en la que todas las líneas de proyección son ortogonales al plano de proyección, lo que da como resultado que cada plano de la escena aparezca en transformación afín en la superficie de visualización.

![raster3](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Axonometric_projection.svg/800px-Axonometric_projection.svg.png)

### Proyección en perspectiva

O la transformación de perspectiva, es una proyección lineal donde los objetos tridimensionales se proyectan en un plano de imagen. Esto tiene el efecto de que los objetos distantes parecen más pequeños que los objetos más cercanos.

![raster4](https://www.researchgate.net/publication/311411647/figure/fig2/AS:435772210847745@1480907599638/Illustration-of-perspective-projection-The-minimum-and-maximum-disparity-in-the-screen.png)

### Anti-aliasing espacial

El anti-aliasing espacial es una técnica que minimiza los artefactos de distorsión conocidos como aliasing cuando se representa una imagen de alta resolución a una resolución más baja. El suavizado se utiliza en fotografía digital, gráficos por computadora, audio digital y muchas otras aplicaciones.

Anti-aliasing significa eliminar los componentes de la señal que tienen una frecuencia más alta que la que puede resolver correctamente el dispositivo de grabación o muestreo. Esta eliminación se realiza antes de (re)muestrear a una resolución más baja. Cuando el muestreo se realiza sin eliminar esta parte de la señal, provoca artefactos no deseados, como el ruido en blanco y negro.

![raster5](https://images.anandtech.com/old/video/t-buffer/spatialaliasing.gif)

## Métodos

### Algoritmo Z-buffer

La idea del algoritmo Z-buffer es usar una matriz 2D (z-buffer o depth-buffer) para almacenar la profundidad del objeto más cercano a la vista del observador. Cuando se renderiza un objeto, la profundidad de un píxel generado (coordenada z) se almacena en el búfer de profundidad. Si se debe pintar otro objeto en el mismo píxel, la profundidad del nuevo píxel se compara con la profundidad almacenada, si la profundidad del nuevo píxel está más cerca que la profundidad almacenada, entonces se anula el valor del píxel en el búfer z. El z-buffer permitirá reproducir correctamente la percepción de la profundidad.

![raster6](https://eccarrilloe.github.io/assets/img/z-buffer2.png)

La imagen muestra dos objetos en un espacio 3D transformado en un plano de proyección 2D. La segunda fila muestra los valores de la matriz del Z-buffer y cómo el algoritmo del Z-buffer procesa la superposición.

Una característica importante del Z-buffer es la granularidad. La granularidad de un Z-buffer define la calidad de la escena. Un Z-buffer de 16 bits podría generar artefactos (llamados z-fighting o stitching) cuando dos objetos están muy cerca uno del otro. A mayor tamaño de Z-buffer, se generará una mejor calidad de imagen, evitando artefactos, pero el problema no se puede eliminar por completo sin algoritmos adicionales. El Z-buffer de 24 o 32 bits es más preciso. Un Z-buffer de 8 bits casi nunca se usa porque tiene muy poca precisión.

![raster7](https://eccarrilloe.github.io/assets/img/z-fighting.png)

<!-- #### Implementación

{{< p5-iframe sketch="/showcase/sketches/z-buffer.js" width="725" height="425" >}} -->

### Rasterización

Una representación común de los modelos 3D digitales es poligonal. Antes de la rasterización, los polígonos individuales se dividen en triángulos, por lo tanto, un problema típico para resolver en la rasterización 3D es la rasterización de un triángulo. Las propiedades que generalmente se requieren de los algoritmos de rasterización de triángulos son la rasterización de dos triángulos adyacentes (aquellos que comparten un borde)

 - No deja agujeros (píxeles no rasterizados) entre los triángulos, de modo que el área rasterizada se llena por completo (al igual que la superficie de los triángulos adyacentes).

 - Ningún píxel se rasteriza más de una vez, es decir, los triángulos rasterizados no se superponen. Esto es para garantizar que el resultado no dependa del orden en que se rasterizan los triángulos. Sobredibujar píxeles también puede significar desperdiciar potencia informática en píxeles que se sobrescribirían.

Esto lleva a establecer reglas de rasterización para garantizar las condiciones anteriores. Un conjunto de tales reglas se denomina regla superior izquierda, que establece que un píxel se rasteriza si y solo si

 - Su centro se encuentra completamente dentro del triángulo.
 - O su centro se encuentra exactamente en el borde del triángulo (o múltiples bordes en el caso de las esquinas) que es (o, en el caso de las esquinas, todos son) el borde superior o el izquierdo.

Una arista superior es una arista que es exactamente horizontal y se encuentra por encima de otras aristas, y una arista izquierda es una arista no horizontal que está en el lado izquierdo del triángulo.


## Resultados

{{< p5-global-iframe id="breath" width="730" height="700" >}}
  
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

{{< /p5-global-iframe >}}

## Conclusiones
 - La calidad de la rasterización se puede mejorar utilizando antialiasing, dado que este genera bordes "suaves". 

 - Aún cuando la rasterización es una técnica bastante antigua esto no impide que sea una técnica sumamente eficiente y que se siga utilizando en la actualidad sacando ventaja del "boom" de las tarjetas gráficas

- La ley de Blinn expresa la observación de que sigue habiendo una brecha entre las imágenes que a las personas les gustaría poder renderizar y las imágenes que pueden renderizar.
 
 - La precisión de los subpíxeles es un método que tiene en cuenta las posiciones en una escala más fina que la cuadrícula de píxeles y puede producir resultados diferentes incluso si los puntos finales de una primitiva caen en las mismas coordenadas de píxeles, produciendo animaciones de movimiento más suaves.

 - El ray-tracing es el primer enfoque posible para resolver el problema de la visibilidad. Decimos que la técnica se centra en la imagen porque "disparamos" rayos desde la cámara hacia la escena (comenzamos desde la imagen) en lugar de al revés, que es el enfoque que usaremos en la rasterización.


## Referencias

 - [Matt Pharr, Wenzel Jakob, and Greg Humphreys, (2004-2021). Physically Based Rendering: From Theory To Implementation](https://pbr-book.org/3ed-2018/Introduction/A_Brief_History_of_Physically_Based_Rendering)
 - [Technopedia, (2022). Rasterization](https://www.techopedia.com/definition/13169/rasterization#:~:text=The%20origin%20of%20image%20rasterization,gradually%20accumulated%20into%20complete%20images)
 - [Scratchapixel 2.0, (2009-2022). Rasterization: a Practical Implementation](https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/overview-rasterization-algorithm)
 - [Edward Carrillo, (2017). Rasterization: Z-buffer Algorithm](https://eccarrilloe.github.io/2017/09/24/Rasterization-Z-buffer-Algorithm/)
 - [Fabian Giesen, (2013). The barycentric conspiracy](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/)
