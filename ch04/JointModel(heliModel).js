// JointModel.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  
  'uniform vec3 u_DiffuseLight;\n' +   // Diffuse light color
  'uniform vec3 u_LightDirection;\n' + // Diffuse light direction (in the world coordinate, normalized)
  'uniform vec3 u_AmbientLight;\n' +   // Color of an ambient light
  
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  // Shading calculation to make the arm look three-dimensional
  //'  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + // Light direction
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, u_LightDirection), 0.0);\n' +
//  '  v_Color = vec4(color.rgb * nDotL + vec3(0.1) + a_Color.rgb, color.a);\n' +
  //'  v_Color = vec4(a_Color.rgb * nDotL + vec3(0.1), a_Color.a);\n' +

  '  vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL;\n' +
     // Calculate the color due to ambient reflection
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
     // Add the surface colors due to diffuse reflection and ambient reflection
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' + 

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

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  var u_DiffuseLight = gl.getUniformLocation(gl.program, 'u_DiffuseLight');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

  // Set the light color (white)
  gl.uniform3f(u_DiffuseLight, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  var lightDirection = new Vector3([0.0, 0.5, 0.7]);
  lightDirection.normalize();     // Normalize
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.6, 0.6, 0.6);


  if (!u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location');
    return;
  }

  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
  var eyeX = 0.0, eyeY= 0.0, eyeZ= 1.0;
  var phi=90.0+90, theta=90.0;
  var zoomScale = 100;
  var sphVec = sphericalVector(phi, theta);
  console.log('sphVec', sphVec);
  eyeX = sphVec[0]; eyeY = sphVec[2]; eyeZ = sphVec[1];
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
  viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  console.log('viewProjMatrix', viewProjMatrix.elements);

  // Register the event handler to be called when keys are pressed
  document.onkeydown = function(ev){ keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); };

  draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);  // Draw the robot arm //여기선 zoom var 없어도 될듯한데..


  function keydown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    if(ev.keyCode == 38 && ev.shiftKey) { // The up arrow key was pressed
        theta -= 5
        console.log('theta', theta);
        var sphVec = sphericalVector(phi, theta);
        console.log('sphVec', sphVec);
        eyeX = sphVec[0]; eyeY = sphVec[2]; eyeZ = sphVec[1];
        console.log('eyeX ...', eyeX, eyeY, eyeZ);
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //viewProjMatrix.elements[14] = 98;
        //viewProjMatrix.elements[15] = 100;
        console.log('shift and up');
        console.log('viewProjMatrix', viewProjMatrix.elements);
    } else 
    
    if(ev.keyCode == 40 && ev.shiftKey) { // The down arrow key was pressed
        theta += 5
        console.log('theta', theta);
        var sphVec = sphericalVector(phi, theta);
        eyeX = sphVec[0]; eyeY = sphVec[2]; eyeZ = sphVec[1];
        console.log('eyeX ...', eyeX, eyeY, eyeZ);
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //viewProjMatrix.elements[14] = 98;
        //viewProjMatrix.elements[15] = 100;
        console.log('shift and down');
        console.log('viewProjMatrix', viewProjMatrix.elements);
    } else 
    
    if(ev.keyCode == 39 && ev.shiftKey) { // The right arrow key was pressed
        phi += 5
        console.log('phi', phi);
        var sphVec = sphericalVector(phi, theta);
        eyeX = sphVec[0]; eyeY = sphVec[2]; eyeZ = sphVec[1];
        console.log('eyeX ...', eyeX, eyeY, eyeZ);

        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        console.log('viewProjMatrix', viewProjMatrix.elements);
    } else 
    
    if(ev.keyCode == 37 && ev.shiftKey) { // The left arrow key was pressed
        phi -= 5
        console.log('phi', phi);
        var sphVec = sphericalVector(phi, theta);
        eyeX = sphVec[0]; eyeY = sphVec[2]; eyeZ = sphVec[1];
        console.log('eyeX ...', eyeX, eyeY, eyeZ);
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        console.log('viewProjMatrix', viewProjMatrix.elements);
    } else 

    if(ev.keyCode == 187 && ev.shiftKey) { // The right arrow key was pressed
        zoomScale += 1
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        console.log('eyeX ...', eyeX, eyeY, eyeZ);
        console.log('viewProjMatrix', viewProjMatrix.elements);
        //draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    } else 
    if(ev.keyCode == 187) { // The right arrow key was pressed
        zoomScale -= 1
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX*zoomScale, eyeY*zoomScale, eyeZ*zoomScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        console.log('eyeX ...', eyeX, eyeY, eyeZ);

        console.log('viewProjMatrix', viewProjMatrix.elements);
        //draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    } else


        

    if(ev.keyCode == 38) { // The up key was pressed
      console.log('u');
      if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;

      // return rotated g_eye's with axis ec x u 
      // return rotated up's with axis ec x u 
    } else 

    if(ev.keyCode == 40) { // The down key was pressed
      console.log('d');
      if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;

      //modelMatrix.translate(0,-0.01, 0);
      //gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      // return rotated g_eye's with axis ec x u 
      // return rotated up's with axis ec x u 
      
    } else 

    if(ev.keyCode == 39) { // The right arrow key was pressed
      console.log('r');
      // return rotated g_eye's with axis up's
      //g_eyeX += 0.01;

    } else 
    if (ev.keyCode == 37) { // The left arrow key was pressed
      console.log('l');
      // return rotated g_eye's with axis up's
      //g_eyeX -= 0.01;
    } else { return; }


    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    }
}

var ANGLE_STEP = 3.0;    // The increments of rotation angle (degrees)
var g_arm1Angle = -90.0; // The rotation angle of arm1 (degrees)
var g_joint1Angle = 0.0; // The rotation angle of joint1 (degrees)
var zoom = 1.0;



function initVertexBuffers(gl, color2) {
  // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
  var vertices = new Float32Array([
  
    1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
    1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
    1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
   -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
   -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down // down 이 xz 평면에 있다.
    1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
  ]);

  if (color2==null) {
  // colors
  var colors = new Float32Array([    // Colors
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
  ]);
  }
  else {
    var colors = color2
  }
  
  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Arm1
  var arm1Length = 15.0; // Length of arm1
  var setTransY = 0.0;
  var arm1Side = 1.5;
  g_modelMatrix.setTranslate(0.0, setTransY, 0.0);
  g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);    // Rotate around the y-axis
  g_modelMatrix.scale(1.0, arm1Length/10.0, 1.0); // Make it a little thicker

  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

  var arm2Length = 10.0; // Length of arm1
  var arm2Side = 2.5;
  // Arm2
  g_modelMatrix.setIdentity();
  g_modelMatrix.translate(0.0, arm1Length, 0.0); 　　　// Move to joint1
  g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  g_modelMatrix.scale(arm2Side/1.5, arm2Length/10.0, arm2Side/1.5); // Make it a little thicker
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom); // Draw

/*
  // Chopper holder
  var holderLength = 2.5; // Length of arm1
  var holderSide = 2.5;
  g_modelMatrix.setIdentity();
  g_modelMatrix.setTranslate(0.0, arm1Length/2 + chopLength/2 - holderLength/2, 3.75); 　　　// Move to joint1
  //g_modelMatrix.setTranslate(0.0, arm1Length+arm2Length/2-holderLength/2, arm2Side/2); 　　　// Move to joint1
  g_modelMatrix.scale(holderSide/1.5, 5*holderLength/10.0, holderSide/1.5); // Make it a little thicker
  g_modelMatrix.rotate(0.0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom); // Draw
*/

  // ChoperY
  var chopLength = 20.0;
  var chopSide = 1.5;
  g_modelMatrix.setIdentity();
  g_modelMatrix.setTranslate(0.0, arm1Length/2, 3.75); 　　　// Move to joint1
  g_modelMatrix.scale(chopSide/3.0, chopLength/10, chopSide/3.0); // Make it a little thicker
  g_modelMatrix.rotate(0.0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom); // Draw

  // ChoperX
  
  g_modelMatrix.setIdentity();
  //g_modelMatrix.translate(1.5*arm1Length, arm1Length/2, 0.0); 　　　// Move to joint1
  //g_modelMatrix.setTranslate(arm1Length*1.0, arm1Length*1.5, 3.5); 　　　// Move to joint1
  g_modelMatrix.rotate(0.0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  //g_modelMatrix.scale(10.0, 2.0, 0.5); // Make it a little thicker
  g_modelMatrix.setTranslate(0.0, arm1Length/2 + chopLength/2 - chopSide/2, 3.75); 　　　// Move to joint1
  g_modelMatrix.scale(chopLength/3.0, chopSide/10.0, chopSide/3.0); // Make it a little thicker


  //g_modelMatrix.scale(1.0, 1.0, 1.0); // Make it a little thicker
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom); // Draw
/*
  // prop2
  g_modelMatrix.setTranslate(0.0, 0.0, 0.0); 　　　// Move to joint1
  g_modelMatrix.rotate(90.0, 1.0, 0.0, 0.0);  // Rotate around the z-axis
  g_modelMatrix.scale(0.35, 0.35, 2.0); // Make it a little thicker
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom); // Draw*/

  // ChoperY
  var chopLength = 8.0;
  var chopSide = 1.5;
  g_modelMatrix.setIdentity();
  g_modelMatrix.setTranslate(arm1Side*1.1/2+chopSide, -chopLength*(0.8)/2, arm1Side/2); 　　　// Move to joint1
  g_modelMatrix.scale(chopSide/3.0, chopLength/10, chopSide/3.0); // Make it a little thicker
  g_modelMatrix.rotate(0.0, 0.0, 0.0, 1.0);  // Rotate around the z-axis
  
  drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom); // Draw

}

var g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals
console.log('g_modelMatrix is callable outmost field?', g_modelMatrix);
// 이 객체는 outmost field에서 선언되었었네.
// Draw the cube
function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, zoom) {
  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate the normal transformation matrix and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}


    
    /*
    switch (ev.keyCode) {
      case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
        if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
        break;
      case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
        if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
        break;
      case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
        g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
        break;
      case (37& 64 +24): // Left arrow key -> the negative rotation of arm1 around the y-axis
        g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
        break;
      case 187://187 is = key
        //zoom += 0.0001
        eyeZ += 1
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX, eyeY, eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        console.log('viewProjMatrix', viewProjMatrix.elements);
        //viewProjMatrix.lookAt(0, 0, 5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //viewProjMatrix.setLookAt(0.1, 0, 0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //console.log('zoom', zoom);
        console.log('viewProjMatrix', viewProjMatrix.elements);
        break;
      
      case (16 && 187)://187 is = key
        //zoom += 0.0001
        eyeZ += 1
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
        viewProjMatrix.lookAt(eyeX, eyeY, eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //viewProjMatrix.lookAt(0, 0, 5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //viewProjMatrix.setLookAt(0.1, 0, 0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        //console.log('zoom', zoom);
        console.log('viewProjMatrix', viewProjMatrix.elements);
        break;
    }
    */
    /*  case 16: // Left arrow key -> the negative rotation of arm1 around the y-axis
        //zoom -= 0.0001
        if (ev.keyCode == 187) {
            eyeZ -= 1
            viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 1000.0);
            viewProjMatrix.lookAt(eyeX, eyeY, eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
            //viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0)
            //viewProjMatrix.setLookAt(-5, 0, 0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
           // viewProjMatrix.lookAt(20.0*zoom, 10.0*zoom, 30.0*zoom, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
            //console.log('zoom', zoom);
            console.log('viewProjMatrix', viewProjMatrix.elements);
        }
        */
     //   break;

      //default: return; // Skip drawing at no effective action
     
    //}
    // Draw the robot arm