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

  draw(gl, n, modelMatrix, u_ModelMatrix);
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
function keydown(ev, gl, n, modelMatrix, u_ModelMatrix) {
    if(ev.keyCode == 38) { // The up key was pressed
      console.log('u');
      modelMatrix.translate(0, 0.01, 0);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

      // return rotated g_eye's with axis ec x u 
      // return rotated up's with axis ec x u 
    } else 

    if(ev.keyCode == 40) { // The down key was pressed
      console.log('d');
      modelMatrix.translate(0,-0.01, 0);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      // return rotated g_eye's with axis ec x u 
      // return rotated up's with axis ec x u 
      
    } else 

    if(ev.keyCode == 39) { // The right arrow key was pressed
      console.log('r');
      // return rotated g_eye's with axis up's
      g_eyeX += 0.01;

    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      console.log('l');
      // return rotated g_eye's with axis up's
      g_eyeX -= 0.01;
    } else { return; }
    
    draw(gl, n, modelMatrix, u_ModelMatrix);    
}


function draw(gl, n, modelMatrix, u_ModelMatrix) {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);

}