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
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {

    if(ev.keyCode == 38) { // The right up key was pressed
      console.log('u');

    } else 

    if(ev.keyCode == 40) { // The right down key was pressed
      console.log('d');
    } else 

    if(ev.keyCode == 39) { // The right arrow key was pressed
      g_eyeX += 0.01;
    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      g_eyeX -= 0.01;
    } else { return; }
    draw(gl, n, u_ViewMatrix, viewMatrix);    
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  // Set the matrix to be used for to set the camera view
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  // Pass the view projection matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);     // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the rectangle
}


testVector4 = new Vector4([1, 2, 3,4]);
console.log(testVector4);


Vector3.prototype.testFunc = function() {
  var v = this.elements;
  var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c*c+d*d+e*e);
  if(g){
    if(g == 1)
        return this;
   } else {
     v[0] = 0; v[1] = 0; v[2] = 0;
     return this;
   }
   g = 1/g;
   v[0] = c*g; v[1] = d*g; v[2] = e*g;
   return this;
};

function AnimalSounds() {}

AnimalSounds.prototype.cow = function() {
    //alert("moo");
    var cow = "moo";
    return this;
}

AnimalSounds.prototype.pig = function() {
    //alert("oink");
    var pig = "oink";
    return this;
}

AnimalSounds.prototype.dog = function() {
    //alert("woof");
    var dog = "woof";
    return this;
}

var sounds = new AnimalSounds();

sounds.cow();
sounds.pig();
sounds.dog();

sounds.cow().pig().dog();

console.log(sounds.cow());
console.log(sounds.pig());
console.log(sounds.dog());

console.log('Math library test sqrt(4)', Math.sqrt(4));

Vector4.prototype.normalize = function() {
  var v = this.elements;
  var c = v[0], d = v[1], e = v[2], f = v[3], g = Math.sqrt(c*c+d*d+e*e+f*f);
     console.log('inthe normalize method : g ', g)

  if(g){
    if(g == 1)
        return this;
   } else {
     //v[0] = 0; v[1] = 0; v[2] = 0; v[3] = 0;
     //return this;
     
   }
   g = 1/g;
   console.log('inthe normalize method : g ', g)
   v[0] = c*g; v[1] = d*g; v[2] = e*g; v[3] = f*g;
   return this;
};
testVec4 = new Vector4(10, 10, 10, 1);
console.log('normalize vec4 test', testVec4.normalize());




Vector4.prototype.cross = function(vecB) {
  var e, fx, fy, fz, sx, sy, sz, upX, upY, upZ;
  console.log('###########################');
  console.log('hello here in the cross method');
  console.log('this.elements', this.elements);
  fx = this.elements[0];
  fy = this.elements[1];
  fz = this.elements[2];
  console.log('after assign fff, this.elements', this.elements);

  console.log('vecB.elements', vecB.elements);

  upX = vecB.elements[0];
  upY = vecB.elements[1];
  upZ = vecB.elements[2];

  //upX = vecB.elements
  console.log('inthe cross method this.elements show', fx, fy, fz);
  // Calculate cross product of f and up.
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;

  // Set to this.
  e = this.elements;
  e[0] = sx;
  e[1] = sy;
  e[2] = sz;
  e[3] = 1;

  console.log('inthe cross method e and typeof e', e, typeof(e));
  // Translate.
  return this;
};

testVec4_2 = new Vector4([1,1,1,1]);
console.log('testVec4_2', testVec4_2);
resVec4 = testVec4.cross(testVec4_2);
console.log('resVec4', resVec4);





var Vector2 = function(opt_src) {
  var v = new Float32Array(2);
  if (opt_src && typeof opt_src === 'object') {
  v[0] = opt_src[0]; v[1] = opt_src[1];
  } 
  this.elements = v;
}

//testVec2 = new Vector2([1 ,2]);

// elements 는 Float32Array 의 내부 객체이다.
testVec2 = new Vector2();
console.log('testVec2', testVec2);

v = new Float32Array(3, [0, 1]);
v.elements = [4, 5, 6];
console.log('Float32Array s elements', v.elements);


// matrix4 메서드 내에서 this. elements 의 NaN 인지(초기화상태인지) 값이 들어가는 상태인지 확인해보자
Matrix4.prototype.translate2 = function(x, y, z) {
  console.log('###########################');
  console.log('here in the translate 2 method');
  console.log('this.elements', this.elements);
  var e = this.elements;
  e[12] += e[0] * x + e[4] * y + e[8]  * z;
  e[13] += e[1] * x + e[5] * y + e[9]  * z;
  e[14] += e[2] * x + e[6] * y + e[10] * z;
  e[15] += e[3] * x + e[7] * y + e[11] * z;
  return this;
};

testMatrix4 = new Matrix4();
testMatrix4.translate2(1,2,3);



Vector4.prototype.cross2 = function(vecB) {
  var e, fx, fy, fz, upX, upY, upZ;
  console.log('###########################');
  console.log('hello here in the cross2222 method');
  console.log('this.elements', this.elements);
  //fx = this.elements[0];
  //fy = this.elements[1];
  //fz = this.elements[2];
  console.log('after assign fff, this.elements', this.elements);

  console.log('vecB.elements', vecB.elements);

  upX = vecB.elements[0];
  upY = vecB.elements[1];
  upZ = vecB.elements[2];

  //upX = vecB.elements
  console.log('inthe cross method this.elements show', fx, fy, fz);
  // Calculate cross product of f and up.
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;

  // Set to this.
  e = this.elements;
  e[0] = sx;
  e[1] = sy;
  e[2] = sz;
  e[3] = 1;

  console.log('inthe cross method e and typeof e', e, typeof(e));
  // Translate.
  return this;
};