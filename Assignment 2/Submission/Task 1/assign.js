var canvas;
var gl;

var numVecs = 0;
var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;

// ---------------------- TASK 1 ----------------------
function task1(){
    // ---- Setup GL ----
    numVecs = 0;
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.disable(gl.DEPTH_TEST);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 0 );
    gl.clear(gl.COLOR_BUFFER_BIT);
    // ------------------

    // ---- Shaders Setup ----
    var vertexShaderText = [
        'attribute vec4 vPosition;',
        'attribute vec4 vColor;',
        'varying vec4 fColor;',
        'void main(){',
        '   gl_Position = vec4(vPosition);',
        '   fColor = vec4(vColor);',
        '}'
    ].join("\n")
        
    var fragmentShaderText = [
        'precision mediump float;',
        'varying vec4 fColor;',
        'void main(){',
        '   gl_FragColor = vec4(fColor);',
        '}'
    ].join("\n")

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // -----------------------

    // ---- Create Program ----
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    gl.useProgram( program );
    // ------------------------

    //COLORS
    var groundColor = vec4(0.5,1,0.25,1);
    var skyColor = vec4(0,1,1,1);
    var houseColor = vec4(1,1,1,1);
    var doorColor = vec4(0.5,0.25,0,1);
    var windowColor = vec4(0,0.85,0.85,1);
    var roofColor = vec4(0.9,0,0,1);
    var colors = [groundColor, skyColor, houseColor, doorColor, windowColor, windowColor, roofColor];

    //POSITIONS
    var ground = [vec2(1, 0), vec2(-1, 0), vec2(1, -1), vec2(-1, -1)];
    var sky = [vec2(1, 1), vec2(-1, 1), vec2(1, 0), vec2(-1, 0)];
    var house = [vec2(-0.4, 0.2 ), vec2(0.4, 0.2), vec2(-0.4, -0.35), vec2(0.4, -0.35)];
    var door = [vec2(-0.08, -0.05), vec2(0.08, -0.05), vec2(-0.08, -0.35), vec2(0.08, -0.35)];
    var leftWindow = [vec2(-0.325, 0.1 ), vec2(-0.125, 0.1), vec2(-0.325, -0.1), vec2(-0.125, -0.1)];
    var rightWindow = [vec2(0.125, 0.1), vec2(0.325, 0.1), vec2(0.125, -0.1), vec2(0.325, -0.1)];
    var roof = [vec2(0, 0.6), vec2(0, 0.6), vec2(-0.5, 0.2), vec2(0.5, 0.2)];
    var objs = [ground, sky, house, door, leftWindow, rightWindow, roof];
    
    //MAIN VECTOR ARRAY
    var vectors = [];
    var obj = 0;
    for(var k=0;k<objs.length*4;k+=4){
        vectors.push(objs[obj][0]);
        vectors.push(objs[obj][1]);
        vectors.push(objs[obj][2]);
        vectors.push(objs[obj][3]);
        obj++;
    }
    numVecs = vectors.length;

    // -------- Creating Buffers and Attributes --------
    var cBuffer = gl.createBuffer();
    var vBuffer = gl.createBuffer();
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    var vColor = gl.getAttribLocation( program, "vColor" );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, gl.FALSE, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, gl.FALSE, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    // -------------------------------------------------

    // ----------- Loading buffers with Position and Color -----------
    var poly = 0;
    for(var i=0;i<numVecs;){
        
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferSubData( gl.ARRAY_BUFFER, 8*(i+0),flatten(vectors[i+0]));
        gl.bufferSubData( gl.ARRAY_BUFFER, 8*(i+1),flatten(vectors[i+1]));
        gl.bufferSubData( gl.ARRAY_BUFFER, 8*(i+2),flatten(vectors[i+2]));
        gl.bufferSubData( gl.ARRAY_BUFFER, 8*(i+3),flatten(vectors[i+3]));
        i+=4;

        var color = colors[poly];
        poly++;
    
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferSubData( gl.ARRAY_BUFFER, 16*(i-4),flatten(color));
        gl.bufferSubData( gl.ARRAY_BUFFER, 16*(i-3),flatten(color));
        gl.bufferSubData( gl.ARRAY_BUFFER, 16*(i-2),flatten(color));
        gl.bufferSubData( gl.ARRAY_BUFFER, 16*(i-1),flatten(color));

    }
    // ---------------------------------------------------------------
    render1();
}

function render1() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    for(var i=0;i<numVecs;i+=4){
        gl.drawArrays( gl.TRIANGLE_STRIP, i, 4 );
    }
}
// ----------------------------------------------------