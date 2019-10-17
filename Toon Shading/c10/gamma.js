
function initShaders() { 
    
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
    
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
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
  
  // Gamma correction
  program.gammaIndex            = gl.getUniformLocation( program, "Gamma");
  gl.uniform1f (program.gammaIndex, 2.2);
  
}

function initRendering() { 

  gl.clearColor(0.15,0.15,0.15,1.0);
  gl.enable(gl.DEPTH_TEST);
  
  setShaderLight();

}

function drawScene() {
  
  var modelMatrix     = mat4.create();
  var modelViewMatrix = mat4.create();
  var normalMatrix    = mat3.create();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // se obtiene la matriz de transformacion de la proyeccion y se envia al shader
  var projectionMatrix  = mat4.create();
  projectionMatrix = getProjectionMatrix();
  setShaderProjectionMatrix(projectionMatrix);
  
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

function initMyHandlers() {
  
  var widgets = document.getElementsByTagName("input");
  
  widgets[1].addEventListener("change",
    function(){
      setColor(program.LaIndex, widgets[1].value);
      requestAnimationFrame(drawScene);
    },
    false);

  widgets[2].addEventListener("change",
    function(){
      setColor(program.LdIndex, widgets[2].value);
      requestAnimationFrame(drawScene);
    },
    false);

  widgets[3].addEventListener("change",
    function(){
      setColor(program.LsIndex, widgets[3].value);
      requestAnimationFrame(drawScene);
    },
    false);
  
  widgets[0].addEventListener("mousemove",
                            function(){
                            var Gamma = parseFloat(widgets[0].value)/10.0;
                            gl.uniform1f (program.gammaIndex, Gamma);
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
  
  gl.uniform3f(index, r, g, b);
  
}

function initMyWebGL() {
    
  initWebGL();
  initMyHandlers();
  
  requestAnimationFrame(drawScene);
  
}

initMyWebGL();
