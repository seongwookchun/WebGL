// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
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
  var n = initVertexBuffers(gl, 0.25);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');


  var modelMatrix = new Matrix4(); // The model matrix
  var viewMatrix = new Matrix4();  // The view matrix
  var projMatrix = new Matrix4();  // The projection matrix

  // Calculate the view matrix and the projection matrix
  modelMatrix.setTranslate(0.75, 0, 0);  // Translate 0.75 units along the positive x-axis
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  // Pass the model, view, and projection matrix to the uniform variable respectively
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


  document.onkeydown = function(ev){ keydown(ev, gl, n, modelMatrix, u_ModelMatrix); };

  // Start drawing
  var currentAngle = 0.0;
  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    //draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle
    draw(gl, n, modelMatrix, u_ModelMatrix);

    drawChop(gl, n, currentAngle, modelMatrix, u_ModelMatrix, bodyMatrix);

    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
  
} // main End

// Last time that this function was called
var g_last = Date.now();
// Rotation angle (degrees/second)
var ANGLE_STEP = 45.0;
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}



function initVertexBuffers(gl, scale) {
  var vertices = new Float32Array([
    0.0 * scale,  0.5 * scale,   
   -0.5 * scale, -0.5 * scale,   
    0.5 * scale, -0.5 * scale,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
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



var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // Eye position
var centerX = 0.0, centerY = 0.0, centerZ = 0.0;
var upX = 0.0, upY = 1.0, upZ = 0.0;
var transMatrix = new Matrix4(); // only tracking translation
function keydown(ev, gl, n, modelMatrix, u_ModelMatrix) {
    if(ev.keyCode == 38) { // The up key was pressed
      console.log('u');
      bodyMatrix.translate(0, 0.01, 0);
      transMatrix.translate(0, 0.01, 0);
      // return rotated g_eye's with axis ec x u 
      // return rotated up's with axis ec x u 
    } else 

    if(ev.keyCode == 40) { // The down key was pressed
      console.log('d');
      bodyMatrix.translate(0,-0.01, 0);

      
      transMatrix.translate(0, -0.01, 0);

      // return rotated g_eye's with axis ec x u 
      // return rotated up's with axis ec x u 
      
    } else 

    if(ev.keyCode == 39) { // The right arrow key was pressed
      console.log('r');
      // return rotated g_eye's with axis up's
      bodyMatrix.rotate(-5, 0, 0, 1.0);

    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      console.log('l');
      bodyMatrix.rotate(5, 0, 0, 1.0);
    } else { return; }
    //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // 잠시대기

    //draw(gl, n, modelMatrix, u_ModelMatrix);    
}


bodyMatrix = new Matrix4();
function draw(gl, n, modelMatrix, u_ModelMatrix) {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  //modelMatrix.setRotate(0, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
  gl.uniformMatrix4fv(u_ModelMatrix, false, bodyMatrix.elements);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
  //gl.drawArrays(gl.TRIANGLES, 0, n);


}

var g_bodyMatrix = new Matrix4();
function drawChop(gl, n, currentAngle, modelMatrix, u_ModelMatrix, bodyMatrix) {
  // Set the rotation matrix
  modelMatrix.setIdentity();
  modelMatrix.setRotate(1, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
  //modelMatrix.setRotate(currentAngle, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
  //modelMatrix.multiply(transMatrix);
  //modelMatrix.multiply(bodyMatrix);
  g_bodyMatrix = bodyMatrix;
  g_bodyMatrix.multiply(modelMatrix);
  // Pass the rotation matrix to the vertex shader
  //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); //순서바꿔서 곱하면?
  gl.uniformMatrix4fv(u_ModelMatrix, false, g_bodyMatrix.elements); //순서바꿔서 곱하면?

  //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.multiply(bodyMatrix).elements); //순서바꿔서 곱하면?
  //gl.uniformMatrix4fv(u_ModelMatrix, false, bodyMatrix.multiply(modelMatrix).elements); // 난장판된다.

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}