
var myFbo, program, programPlane;

var OFFSCREEN_WIDTH = 660*2, OFFSCREEN_HEIGHT = 660*2;

function initShaders() { 
    
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
    
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  
  programPlane = gl.createProgram();
  gl.attachShader(programPlane, vertexShader);
  gl.attachShader(programPlane, fragmentShader);
  
  gl.linkProgram(programPlane);

  gl.useProgram(programPlane);
  
  programPlane.vertexPositionAttribute = gl.getAttribLocation( programPlane, "VertexPosition");
  gl.enableVertexAttribArray(programPlane.vertexPositionAttribute);
  
  programPlane.vertexTexcoordsAttribute = gl.getAttribLocation ( programPlane, "VertexTexcoords");
  gl.enableVertexAttribArray(programPlane.vertexTexcoordsAttribute);
  
  programPlane.textureIndex             = gl.getUniformLocation( programPlane, "myTexture");
  gl.uniform1i(programPlane.textureIndex, 0);
  programPlane.brightnessIndex          = gl.getUniformLocation( programPlane, "Brightness");
  gl.uniform1f(programPlane.brightnessIndex, 1.0);
  programPlane.saturationIndex          = gl.getUniformLocation( programPlane, "Saturation");
  gl.uniform1f(programPlane.saturationIndex, 0.5);
  programPlane.contrastIndex            = gl.getUniformLocation( programPlane, "Contrast");
  gl.uniform1f(programPlane.contrastIndex, 0.5);

  
  
  
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShaderFBO").text);
  gl.compileShader(vertexShader);
    
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShaderFBO").text);
  gl.compileShader(fragmentShader);
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
    
  gl.useProgram(program);
    
  program.vertexPositionAttribute = gl.getAttribLocation( program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

  program.modelViewMatrixIndex  = gl.getUniformLocation( program, "modelViewMatrix");
  program.projectionMatrixIndex = gl.getUniformLocation( program, "projectionMatrix");
  
  // normales
  program.vertexNormalAttribute = gl.getAttribLocation ( program, "VertexNormal");
  program.normalMatrixIndex     = gl.getUniformLocation( program, "normalMatrix");
  gl.enableVertexAttribArray(program.vertexNormalAttribute);

  // coordenadas de textura
  //program.vertexTexcoordsAttribute = gl.getAttribLocation ( program, "VertexTexcoords");
  //gl.enableVertexAttribArray(program.vertexTexcoordsAttribute);

  // material
  program.KaIndex               = gl.getUniformLocation( program, "Material.Ka");
  program.KdIndex               = gl.getUniformLocation( program, "Material.Kd");
  program.KsIndex               = gl.getUniformLocation( program, "Material.Ks");
  program.alphaIndex            = gl.getUniformLocation( program, "Material.alpha");

  // fuente de luz
  program.LaIndex               = gl.getUniformLocation( program, "Light.La");
  program.LdIndex               = gl.getUniformLocation( program, "Light.Ld");
  program.LsIndex               = gl.getUniformLocation( program, "Light.Ls");
  program.PositionIndex         = gl.getUniformLocation( program, "Light.Position");

  gl.useProgram(program);
  
}

function initRendering() { 

  gl.clearColor(0.15,0.15,0.15,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();

}

function drawExamplePlane2(model) {
    
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer (programPlane.vertexPositionAttribute,  3, gl.FLOAT, false, 5*4,   0);
  gl.vertexAttribPointer (programPlane.vertexTexcoordsAttribute, 2, gl.FLOAT, false, 5*4, 3*4);

  gl.bindBuffer   (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.drawElements (gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

}

function drawTanque () {
  
  var modelMatrix     = mat4.create();
  var modelViewMatrix = mat4.create();
  var normalMatrix    = mat3.create();

  // suelo
  setShaderMaterial(brass);
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.0,-0.1,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [4,1,4]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  normalMatrix = getNormalMatrix(modelViewMatrix);
  setShaderNormalMatrix(normalMatrix);
  drawSolidWithoutTexcoords(examplePlane);
  
  // ruedas
  setShaderMaterial(Chrome);
  for (var i = 0; i < 5; i++) {
    mat4.identity  (modelMatrix);
    mat4.translate (modelMatrix,modelMatrix, [0.2*i,0.0,0.0]);
    mat4.scale     (modelMatrix,modelMatrix, [0.1,0.1,0.8]);
    mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
    setShaderModelViewMatrix(modelViewMatrix);
    normalMatrix = getNormalMatrix(modelViewMatrix);
    setShaderNormalMatrix(normalMatrix);
    drawSolidWithoutTexcoords(exampleCylinder);
  }
  
  // tapas de las ruedas
  for (var i = 0; i < 5; i++) {
    mat4.identity  (modelMatrix);
    mat4.translate (modelMatrix,modelMatrix, [0.2*i,0.0,0.0]);
    mat4.rotate    (modelMatrix,modelMatrix, 3.14, [0.0,1.0,0.0]);
    mat4.scale     (modelMatrix,modelMatrix, [0.1,0.1,0.01]);
    mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
    setShaderModelViewMatrix(modelViewMatrix);
    normalMatrix = getNormalMatrix(modelViewMatrix);
    setShaderNormalMatrix(normalMatrix);
    drawSolidWithoutTexcoords(exampleCone);
    mat4.identity  (modelMatrix);
    mat4.translate (modelMatrix,modelMatrix, [0.2*i,0.0,0.8]);
    mat4.scale     (modelMatrix,modelMatrix, [0.1,0.1,0.01]);
    mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
    setShaderModelViewMatrix(modelViewMatrix);
    normalMatrix = getNormalMatrix(modelViewMatrix);
    setShaderNormalMatrix(normalMatrix);
    drawSolidWithoutTexcoords(exampleCone);
  }
  
  // cuerpo
  setShaderMaterial(Polished_copper);
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[-0.1,0.1,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [1.0,0.2,0.8]);
  mat4.translate(modelMatrix,modelMatrix,[0.5,0.5,0.5]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  normalMatrix = getNormalMatrix(modelViewMatrix);
  setShaderNormalMatrix(normalMatrix);
  drawSolidWithoutTexcoords(exampleCube);
  
  // torreta
  setShaderMaterial(Gold);
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.2]);
  mat4.scale(modelMatrix,modelMatrix, [0.2,0.2,0.4]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  normalMatrix = getNormalMatrix(modelViewMatrix);
  setShaderNormalMatrix(normalMatrix);
  drawSolidWithoutTexcoords(exampleCylinder);
  
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.2]);
  mat4.rotate    (modelMatrix,modelMatrix, 3.14, [0.0,1.0,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [0.2,0.2,0.001]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  normalMatrix = getNormalMatrix(modelViewMatrix);
  setShaderNormalMatrix(normalMatrix);
  drawSolidWithoutTexcoords(exampleCone);
  
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.6]);
  mat4.scale(modelMatrix,modelMatrix, [0.2,0.2,0.001]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  normalMatrix = getNormalMatrix(modelViewMatrix);
  setShaderNormalMatrix(normalMatrix);
  drawSolidWithoutTexcoords(exampleCone);
  
  // cañon
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix,modelMatrix,[0.7,0.3,0.4]);
  mat4.rotate(modelMatrix,modelMatrix, -Math.PI/8, [0,0,1]);
  mat4.rotate(modelMatrix,modelMatrix, -Math.PI/2.0, [0.0,1.0,0.0]);
  mat4.scale(modelMatrix,modelMatrix, [0.03,0.03,0.8]);
  mat4.multiply  (modelViewMatrix, getCameraMatrix(), modelMatrix);
  setShaderModelViewMatrix(modelViewMatrix);
  normalMatrix = getNormalMatrix(modelViewMatrix);
  setShaderNormalMatrix(normalMatrix);
  drawSolidWithoutTexcoords(exampleCylinder);

}

function drawScene() {
    
  // Primero la escena desde la fuente de luz
  gl.bindFramebuffer (gl.FRAMEBUFFER, myFbo);                     // Change the drawing destination to FBO
  gl.viewport        (0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT);  // Set viewport for FBO
  gl.clear           (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO

  gl.useProgram(program);
  
  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  var projectionMatrix  = mat4.create();
  projectionMatrix = getProjectionMatrix();
  setShaderProjectionMatrix(projectionMatrix);
  
  drawTanque();

  // Ahora la escena desde la cámara del usuario
  gl.bindFramebuffer (gl.FRAMEBUFFER, null);                      // Change the drawing destination to color buffer
  gl.viewport        (0, 0, 660, 660);
  gl.clear           (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffer

  gl.useProgram(programPlane);
  drawExamplePlane2(examplePlane2);
      
}

function initMyHandlers() {


  var widgets = document.getElementsByTagName("input");
  
  widgets[0].addEventListener("change",
    function(){
      setColor(program.LaIndex, widgets[0].value);
      requestAnimationFrame(drawScene);
    },
    false);

  widgets[1].addEventListener("change",
    function(){
      setColor(program.LdIndex, widgets[1].value);
      requestAnimationFrame(drawScene);
    },
    false);

  widgets[2].addEventListener("change",
    function(){
      setColor(program.LsIndex, widgets[2].value);
      requestAnimationFrame(drawScene);
    },
    false);
  
  widgets[3].addEventListener("mousemove",
                            function(){
                            var Brightness = parseFloat(widgets[3].value)/25.0;
                            gl.uniform1f (programPlane.brightnessIndex, Brightness);
                            requestAnimationFrame(drawScene);
                            },
                            false);
  
  widgets[4].addEventListener("mousemove",
                            function(){
                            var Saturation = parseFloat(widgets[4].value)/100.0;
                            gl.uniform1f (programPlane.saturationIndex, Saturation);
                            requestAnimationFrame(drawScene);
                            },
                            false);
 
  widgets[5].addEventListener("mousemove",
                            function(){
                            var Contrast = parseFloat(widgets[5].value)/100.0;
                            gl.uniform1f (programPlane.contrastIndex, Contrast);
                            requestAnimationFrame(drawScene);
                            },
                            false);

}        

function setColor (index, value) {

  var myColor = value.substr(1); // para eliminar el # del #FCA34D
      
  var r = myColor.charAt(0) + '' + myColor.charAt(1);
  var g = myColor.charAt(2) + '' + myColor.charAt(3);
  var b = myColor.charAt(4) + '' + myColor.charAt(5);

  r = parseInt(r, 16) / 255.0;
  g = parseInt(g, 16) / 255.0;
  b = parseInt(b, 16) / 255.0;
  
  gl.useProgram(program);
  gl.uniform3f(index, r, g, b);
  gl.useProgram(program);
  
}

function initFramebufferObject() {
  
  // Create a texture object and set its size and parameters
  var texture = gl.createTexture();
  gl.bindTexture  (gl.TEXTURE_2D, texture);
  gl.texImage2D   (gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT,
                   0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
  
  // Create a renderbuffer object and Set its size and parameters
  var depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
  
  // Create a framebuffer object (FBO)
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer        (gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D   (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  framebuffer.texture = texture;
  
  return framebuffer;
  
}

function initMyWebGL() {
    
  initWebGL();
  initMyHandlers();
  
  // Initialize framebuffer object (FBO)
  myFbo = initFramebufferObject();
  
  // Set a texture object to the texture unit
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture  (gl.TEXTURE_2D, myFbo.texture);

  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
