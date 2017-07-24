const mimeFragmentShader = 'x-shader/x-fragment';
const mimeVertexShader = 'x-shader/x-vertex';

export function compileShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader {
    const shader = gl.createShader(shaderType);
    if (shader == null)
        throw gl.getError();

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader) + ':\n' + shaderSource || 'failed to compile shader');

    return shader;
}

export function createShader(gl: WebGLRenderingContext, shaderId: string): WebGLShader {
    var tag = <HTMLScriptElement>document.getElementById(shaderId);
    if (!tag)
        throw new Error('Shader script tag ' + shaderId + ' not found.');

    var type = null;

    if (tag.type === mimeFragmentShader)
        type = gl.FRAGMENT_SHADER;
    else if (tag.type === mimeVertexShader)
        type = gl.VERTEX_SHADER;
    else throw new Error('Unknown shader type, expected "' + mimeVertexShader + '" or "' + mimeFragmentShader + '", got "' + tag.type + '"');

    return compileShader(gl, tag.text, type);
}

export function createProgram(gl: WebGLRenderingContext, vertex: WebGLShader, fragment: WebGLShader): WebGLProgram {

    var program = gl.createProgram();
    if (program == null)
        throw gl.getError();

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program) || 'failed to link program');

    return program;
}

export function createProgramFromScripts(gl: WebGLRenderingContext, vertexId: string, fragmentId: string): WebGLProgram {
    var vertex = createShader(gl, vertexId);
    var fragment = createShader(gl, fragmentId);

    return createProgram(gl, vertex, fragment);
}