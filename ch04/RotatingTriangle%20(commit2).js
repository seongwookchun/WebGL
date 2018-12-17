// RotatingTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'varying vec4 u_TotTransVec;\n' +
  'varying vec4 u_TempTransVec;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_TransMatrix;\n' +

  'uniform mat4 u_ViewMatrix;\n' +


  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  u_TotTransVec = u_TotTransVec + u_TempTransVec;\n' +
  '  gl_Position = u_ModelMatrix * a_Position + u_TransMatrix * vec4(1.0, 1.0, 1.0, 1.0);\n' +
  '  v_Color = a_Color;\n' +
  '  gl_PointSize = 10.0;\n' +


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

// Rotation angle (degrees/second)
var ANGLE_STEP = 45.0;

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
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var u_TransMatrix = gl.getUniformLocation(gl.program, 'u_TransMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var u_TotTransVec = gl.getUniformLocation(gl.program, 'u_TotTransVec');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var u_TempTransVec = gl.getUniformLocation(gl.program, 'u_TempTransVec');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  
  var tempTransVec = new Vector4();
  var tempTransMatrix = new Matrix4(); 
  tempTransMatrix.translate(0, 0.25, 0);
  tempTransVec = tempTransMatrix.concat(tempTransVec);
  console.log('tempTransVec', tempTransVec);
  // Current rotation angle
  var currentAngle = 90.0;
  var steerAngle = 0.0;
  // Model matrix
  //var modelMatrix = new Matrix4();
  

  /*var totTransMatrix = new Matrix4();
  totTransMatrix.setRotate(0, 0,0,1);
  console.log('totTransMatrix initialized in main method', totTransMatrix);
  */

  tempMatrix = new Matrix4();
  totTransMatrix = new Matrix4();
  document.onkeydown = function(ev){ keydown(ev, gl, n); };
  //var steerAngle = 0.0
  // Start drawing
  function keydown(ev, gl, n,) {
                 //totTransMatrix, modelMatrix, transMatrix) {
  //currentAngle = animate(currentAngle);
  //console.log('currentAngle', currentAngle);
  //modelMatrix.setRotate(currentAngle, 0, 0, 1);
  
  if(ev.keyCode == 38) { // The right up key was pressed
    //tempMatrix = modelMatrix;
    tempMatrix.setRotate(currentAngle, 0, 0, 1);
    tempMatrix.translate(0, 0.25, 0);
    //console.log('currentAngle', currentAngle);
    //console.log(tempMatrix);
    //var tempSumMatrix = matrixAdd(totTransMatrix, tempMatrix);
    //var tempSumMatrix = matrixAdd(totTransMatrix, tempMatrix);
    //tempSumMatrix = matrixAdd(totTransMatrix, totTransMatrix);
    
    tempSumMatrix = matrixAdd(totTransMatrix, totTransMatrix);
    console.log('type of tempSumMatrix', typeof(tempSumMatrix));
    totTransMatrix = tempSumMatrix; 
    console.log('totTransMatrix added');
    console.log(totTransMatrix);
    //modelMatrix.setRotate(currentAngle, 0, 0, 1);


    console.log('u');
    //console.log(tempMatrix.multiply(tempMatrix));
    //totTransMatrix = totTransMatrix + modelMatrix * transMatrix;
    //console.log(tempMatrix);
  } else 

  if(ev.keyCode == 40) { // The right down key was pressed
    gl.uniformMatrix4fv(u_TempTransVec, false, tempTransVec.elements);
    console.log('d');
  } else 

  if(ev.keyCode == 39) { // The right arrow key was pressed
    console.log('r');
    steerAngle -= (5.0);
    console.log('steerAngle', steerAngle, typeof(steerAngle));

  } else 
  if (ev.keyCode == 37) { // The left arrow key was pressed
    console.log('left');
    steerAngle += (5.0);
    console.log('steerAngle', steerAngle);

  } else { return; }
  //draw(gl, n, u_ViewMatrix, viewMatrix);    
}
  gl.clear(gl.COLOR_BUFFER_BIT);
  draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle  

  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    //currentPos = animatePos();
    draw(gl, n, 
              currentAngle,
              modelMatrix, u_ModelMatrix, 
              steerAngle,
              transMatrix, u_TransMatrix, totTransMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
  
  
  
}
var modelMatrix = new Matrix4();
var transMatrix = new Matrix4();
//var totTransMatrix = new Matrix4();
//totTransMatrix.translate(0, 0, 0);
//totTransMatrix.setRotate(0, 0,0,1);
//console.log('totTransMatrix initialized in outside', totTransMatrix);
  
transMatrix.setRotate(0.0, 0, 0, 1);
console.log(transMatrix);
function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
  // Vertex coordinates and color
   0.0,  0.5,  1.0,  0.0,  0.0, 
  -0.5, -0.5,  0.0,  1.0,  0.0, 
   0.5, -0.5,  0.0,  0.0,  1.0, 
  ]);
  var n = 3;   // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);


  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  // Unbind the buffer object
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

function draw(gl, n, 
              currentAngle,
              modelMatrix, u_ModelMatrix, 
              steerAngle,
              transMatrix, u_TransMatrix, totTransMatrix) {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT); // clear 함수 위치는 크게 중요하지 않은듯
  
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
  //modelMatrix.setRotate(45, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
  //transMatrix.setRotate(currentAngle, 0, 0, 1);
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  //gl.uniformMatrix4fv(u_TransMatrix, false, totTransMatrix.elements);

  
  //transMatrix.setTranslate(0.0, 0.1, 0.0);
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);

  
  modelMatrix.setRotate(steerAngle, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)
 
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  //gl.drawArrays(gl.POINTS, 0, n);

  //totTransMatrix = totTransMatrix;// + tempMatrix;

  gl.uniformMatrix4fv(u_TransMatrix, false, tempMatrix.elements);
  gl.drawArrays(gl.POINTS, 0, n);
  
  console.log('steerAngle', steerAngle);
  

}

// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

//var steerAngle = 0.0 // 되긴하는데... NaN으로되네



// Matrix4 addition function
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
  return e;
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