// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
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

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function vecAdd(A,B) {
  var a, b, e, f
  f = new Vector4(4);
  e = f.elements;
  a = new Vector4([10, 20, 30, 40]);
  a = a.elements;
  b = new Vector4([4, 3, 2, 1]);
  b = b.elements;

  console.log('before f', f);
  console.log('before e', e);
  
  for (i=0; i<4; i++) {
    e[i] = a[i] + b[i]
  }
  return e
}

vectorA = new Vector4([1, 2, 3, 4]);
vectorB = new Vector4([4, 3, 2, 1]);

console.log('vecAdd', vecAdd(vectorA, vectorB));

function vector4Add(A, B) {
  var i, e, f, a, b, a0, a1, a2, a3;
  
  // Calculate e = a * b
  f = new Vector4(4);
  e = f.elements;
  a = A.elements;
  b = B.elements;
  console.log('vec A', A);
  console.log('vec A item', a);
  console.log('vec B', B);
  console.log('vec B item', b);
  // If e equals b, copy b to temporary matrix.
  /*if (e === b) {
    b = new Float32Array(16);
    for (i = 0; i < 16; ++i) {
      b[i] = e[i];
    }
  }*/
  for (i=0; i< 4; i++) {
  console.log('inner vecAdd func, for loop');
  console.log(i);
  
  console.log(vectorA.elements[i]);
  console.log(vectorB.elements[i]);
  }

  //a0=a[0];  
  a1=A.elements[1]; 
  a2=a[2];  
  a3=a[3];
  b0=b[0];  b1=b[1];  b2=b[2];  b3=b[3];
  e[0]  =  a0 + b0;
  e[1]  =  a1 + b1;
  e[2]  =  a2 + b2;
  e[3]  =  a3 + b3;
  console.log('vec e', f);
  console.log('vec e item', f.elements);
  return e;
};



vectorA = new Vector4([1, 2, 3, 4]);
vectorB = new Vector4([4, 3, 2, 1]);



console.log(vectorA.elements);
console.log(typeof(vectorA.elements));
for (i=0; i< 4; i++) {
  console.log(i);

  console.log(vectorA.elements[i]);
  console.log(vectorB.elements[i]);
}

//console.log('vector addition', vector4Add(vectorA.elements, vectorB.elements));
