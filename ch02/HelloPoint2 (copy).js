// HelloPint2.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' + // attribute variable
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n'; 

// Fragment shader program
var FSHADER_SOURCE = 
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Pass vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.0, 1.0, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);
  gl.vertexAttrib3f(a_Position, 1.0, 0.0, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);
  gl.vertexAttrib3f(a_Position, 0.0, -.5, 0.0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
    
  // Draw  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);
}
setMatrix = new Matrix4();
setMatrix.set([1,1,1,1, 0,0,0,0, 2,2,2,2, 3,3,3,3]);
console.log('matrix4 set practice', setMatrix);
function matrixAdd(A, B) {
  var i, f, a, b, ai0, ai1, ai2, ai3;
  
  // Calculate e = a * b
  f = new Matrix4();
  e = f.elements
  a = A.elements;
  b = B.elements;
  console.log('mat A', A);
  console.log('mat A item', a);
  console.log('mat B', B);
  console.log('mat B item', b);
  // If e equals b, copy b to temporary matrix.
  /*if (e === b) {
    b = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      b[i] = e[i];
    }
  }*/

  for (i = 0; i < 4; i++) {
    ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
    bi0=b[i];  bi1=b[i+4];  bi2=b[i+8];  bi3=b[i+12];
     e[i]    =  ai0 + bi0;
     e[i+4]  =  ai1 + bi1;
     e[i+8]  =  ai2 + bi2;
     e[i+12] =  ai3 + bi3;
  }
  console.log('mat e', f);
  console.log('mat e item', f.elements);
  return Matrix4().set(e);
};

matrixA = new Matrix4();
matrixB = new Matrix4();

matrixA.setRotate(60, 0, 0, 1);
console.log('########################################');

console.log('roateted A', matrixA);
matrixB.setTranslate(0, 0, 10);
console.log('translated B', matrixB);

console.log('A * B', matrixA.multiply(matrixB));



console.log('########################################');
console.log('A+A', matrixAdd(matrixA,matrixA));
console.log('B+B', matrixAdd(matrixB,matrixB).elements);

//console.log('e call from local assignment', e);