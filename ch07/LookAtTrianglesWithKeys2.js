// LookAtTrianglesWithKeys.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
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

  // Set the vertex coordinates and color (the blue triangle is in the front)
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get the storage location of u_ViewMatrix
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) { 
    console.log('Failed to get the storage locations of u_ViewMatrix');
    return;
  }

  // Create the view matrix
  var viewMatrix = new Matrix4();
  // Register the event handler to be called on key press
  document.onkeydown = function(ev){ keydown(ev, gl, n, u_ViewMatrix, viewMatrix); };

  draw(gl, n, u_ViewMatrix, viewMatrix);   // Draw
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ]);
  var n = 9;

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex information and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // Assign the buffer object to a_Color variable
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  return n;
}

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // Eye position
var vecEye = new Float32Array(4);
vecEye[0] = g_eyeX; vecEye[1] = g_eyeY; vecEye[2] = g_eyeZ;
var rotMatrix = new Matrix4();

var cenX = 0.0 , cenY = 0.0 , cenZ = 0.0 , upX = 0.0 , upY = 1.0 , upZ = 0.0;
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if(ev.keyCode == 38) { // The right up key was pressed
      console.log('u');

    } else 

    if(ev.keyCode == 40) { // The right down key was pressed
      console.log('d');
    } else 
    
    var angle = 10.0;
    var tempVec = new Float32Array(4)
    if(ev.keyCode == 39) { // The right arrow key was pressed
      rotMatrix.rotate(angle, upX, upY, upZ);
      rotMatrix.mulVector4(vecEye);
      console.log('check return value of rotMatrix', rotMatrix);

    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      tempMatrix.rotate(-angle, upX, upY, upZ);
      //g_eyeX -= 0.01;
    } else { return; }
    draw(gl, n, u_ViewMatrix, viewMatrix);    
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  // Set the matrix to be used for to set the camera view
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, cenX, cenY, cenZ, upX, upY, upZ);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);     // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the rectangle
}






Vector4.prototype.add = function(vecB) {
  var v = this.elements;
  var w = vecB.elements

  var c = new Float32Array(4);
  
  for (i = 0; i < 4; ++i) {
      c[i] = v[i] + w[i];
    }
  
  this.elements = c;
  console.log('updated this.elements', this.elements);
};



Vector4.prototype.cross = function(vecB) {
    var fx, fy, fz, sx, sy, sz, ux, uy, uz;
    
    s = this.elements;
    sx = s[0];
    sy = s[1];
    sz = s[2];

    f = vecB.elements;
    fx = f[0];
    fy = f[1];
    fz = f[2];

    u = new Float32Array(4);
    u[0] = sy * fz - sz * fy;
    u[1] = sz * fx - sx * fz;
    u[2] = sx * fy - sy * fx;

    this.elements = u;
}

Matrix4.prototype.mulVector4 = function(vecB) {
  var e = this.elements;
  console.log('this.elements before update', this.elements);
  var p = vecB.elements;

  var u = new Float32Array(4);
  u[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[ 8] + p[3] * e[12];
  u[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[ 9] + p[3] * e[13];
  u[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
  u[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];

  
  this.elements = u;
  console.log('this.elements after update', this.elements);
  return this;
};
/*
testVec4 = new Vector4([10, 10, 10, 10]);

testVec4_B = new Vector4([0,1,0, 1]);
testVec4.add(testVec4_B);
console.log('add vec4 test', testVec4);
/*
testVec4.cross(testVec4_B);
console.log('updated cross', testVec4);*/
/*
testMatrixA = new Matrix4();
testMatrixA.setRotate(90, 0, 0, 1);

//testMatrixA.mulVector4(testVec4);
testMatrixA.mulVector4(new Vector4([1,0,0,1]));
console.log('check return value' , testMatrixA);
*/

/*
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {

    if(ev.keyCode == 38) { // The right up key was pressed
      console.log('u');

    } else 

    if(ev.keyCode == 40) { // The right down key was pressed
      console.log('d');
    } else 
    
    var angle = 10.0;
    var rotMatrix = new Matrix4();
    var vecUp = new Vector4();
    vecUp[0] = upX; vecUp[1] = upY; vecUp[2] = upZ;

    var tempVec = new Float32Array(4)
    if(ev.keyCode == 39) { // The right arrow key was pressed
      
  
      rotMatrix.setRotate(angle, upX, upY, upZ);
      tempVec.elements = rotMatrix.mulVector4(vecEye);
      console.log('multiplyVector4 updated tempVec', tempVec);
      //g_eyeX = tempMatrix.multiplyVector4(Vector4([1,0,0,1]));
      //vecEye.elements = tempMatrix;
    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      tempMatrix.rotate(-angle, upX, upY, upZ);
      //g_eyeX -= 0.01;
    } else { return; }
    draw(gl, n, u_ViewMatrix, viewMatrix);    
}
*/