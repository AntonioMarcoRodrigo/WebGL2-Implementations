"use strict";

var ShaderManager = function( )
{
	this.program;
	this.shaders = [ ];
};

ShaderManager.prototype.createShader = function( source, shaderType )
{
	var shader = this.compileShader ( source, shaderType );
	this.shaders.push( shader );
};

ShaderManager.prototype.compileShader = function( shaderSource, shaderType )
{
	if( shaderSource === null )
		this.throwError( shaderSource + "null or undefined");

	var compiledShader;
	compiledShader = gl.createShader( shaderType );
	gl.shaderSource( compiledShader, shaderSource );
	gl.compileShader( compiledShader );

	if (!gl.getShaderParameter( compiledShader, gl.COMPILE_STATUS ))
	{
		this.throwError("Error compiling shader:" 
						 + gl.getShaderInfoLog(compiledShader)
						 + shaderSource );
	}
	return compiledShader;
};

ShaderManager.prototype.createProg = function( ) 
{
	this.program = gl.createProgram();
	for (var i = 0; i < this.shaders.length; i++)
		gl.attachShader(this.program, this.shaders[i]);
};

ShaderManager.prototype.linkProg = function( )
{
	gl.linkProgram(this.program);
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
		this.throwError("Error in program linking:" + gl.getProgramInfoLog(this.mCompiledShader));
};

ShaderManager.prototype.useProg = function()
{
	gl.useProgram(this.program);
};

ShaderManager.prototype.throwError = function( message )
{
	alert("ERROR");
	console.warn( message );
	throw "SHADER ERROR";
};
