/**
 * @file src/engine/webglCapabilities.ts
 * @description WebGL / WebGL2 feature detection, hardware limits, and context listener utilities.
 */

export interface WebGLCapabilities {
  readonly isWebGL2: boolean;
  readonly maxTextureSize: number;
  readonly maxCubeMapTextureSize: number;
  readonly maxRenderBufferSize: number;
  readonly maxVertexTextureImageUnits: number;
  readonly floatTexturesSupported: boolean;
  readonly halfFloatTexturesSupported: boolean;
  readonly srgbTexturesSupported: boolean;
  readonly parallelShaderCompile: boolean;
  readonly anisotropicFilteringMax: number;
  readonly vendor: string;
  readonly renderer: string;
}

/**
 * Probes the client environment for WebGL / WebGL2 capabilities and hardware ceilings.
 */
export function detectWebGLCapabilities(
  customCanvas?: HTMLCanvasElement | OffscreenCanvas
): WebGLCapabilities {
  if (typeof window === 'undefined' && !customCanvas) {
    return {
      isWebGL2: false,
      maxTextureSize: 2048,
      maxCubeMapTextureSize: 2048,
      maxRenderBufferSize: 2048,
      maxVertexTextureImageUnits: 8,
      floatTexturesSupported: false,
      halfFloatTexturesSupported: false,
      srgbTexturesSupported: false,
      parallelShaderCompile: false,
      anisotropicFilteringMax: 1,
      vendor: 'Server / Node.js Environment',
      renderer: 'Headless Mock',
    };
  }

  const canvas =
    customCanvas ??
    (typeof document !== 'undefined' ? document.createElement('canvas') : undefined);
  if (!canvas) {
    return {
      isWebGL2: false,
      maxTextureSize: 2048,
      maxCubeMapTextureSize: 2048,
      maxRenderBufferSize: 2048,
      maxVertexTextureImageUnits: 8,
      floatTexturesSupported: false,
      halfFloatTexturesSupported: false,
      srgbTexturesSupported: false,
      parallelShaderCompile: false,
      anisotropicFilteringMax: 1,
      vendor: 'Unknown',
      renderer: 'Unknown',
    };
  }

  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  let isWebGL2 = false;

  try {
    gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
    if (gl) {
      isWebGL2 = true;
    } else {
      gl =
        (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
        (canvas instanceof HTMLCanvasElement
          ? (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
          : null);
    }
  } catch {
    gl = null;
  }

  if (!gl) {
    return {
      isWebGL2: false,
      maxTextureSize: 0,
      maxCubeMapTextureSize: 0,
      maxRenderBufferSize: 0,
      maxVertexTextureImageUnits: 0,
      floatTexturesSupported: false,
      halfFloatTexturesSupported: false,
      srgbTexturesSupported: false,
      parallelShaderCompile: false,
      anisotropicFilteringMax: 0,
      vendor: 'Unsupported',
      renderer: 'Unsupported',
    };
  }

  // 1. Hardware Texture and Buffer Ceilings
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  const maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE) as number;
  const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number;
  const maxVertexTextureImageUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) as number;

  // 2. High Dynamic Range (HDR) / Float Texture Capabilities
  const floatTexturesSupported = isWebGL2
    ? Boolean(gl.getExtension('EXT_color_buffer_float'))
    : Boolean(gl.getExtension('OES_texture_float'));

  const halfFloatTexturesSupported = isWebGL2
    ? Boolean(gl.getExtension('EXT_color_buffer_half_float'))
    : Boolean(gl.getExtension('OES_texture_half_float'));

  // 3. Color Space Handling (sRGB framebuffers)
  const srgbTexturesSupported = isWebGL2 ? true : Boolean(gl.getExtension('EXT_sRGB'));

  // 4. Asynchronous / Parallel Shader Compilation
  const parallelShaderCompile = Boolean(gl.getExtension('KHR_parallel_shader_compile'));

  // 5. Texture Filtering & Anisotropy
  const extAniso =
    gl.getExtension('EXT_texture_filter_anisotropic') ||
    gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
    gl.getExtension('MOZ_EXT_texture_filter_anisotropic');

  const anisotropicFilteringMax = extAniso
    ? (gl.getParameter(extAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number)
    : 1;

  // 6. GPU Hardware Identity and Debug Info
  let vendor = 'Unknown';
  let renderer = 'Unknown';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    vendor = (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string) ?? 'Unknown';
    renderer = (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string) ?? 'Unknown';
  } else {
    vendor = (gl.getParameter(gl.VENDOR) as string) ?? 'Unknown';
    renderer = (gl.getParameter(gl.RENDERER) as string) ?? 'Unknown';
  }

  // Release context resources if created dynamically
  if (!customCanvas && canvas instanceof HTMLCanvasElement) {
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }
  }

  return {
    isWebGL2,
    maxTextureSize,
    maxCubeMapTextureSize,
    maxRenderBufferSize,
    maxVertexTextureImageUnits,
    floatTexturesSupported,
    halfFloatTexturesSupported,
    srgbTexturesSupported,
    parallelShaderCompile,
    anisotropicFilteringMax,
    vendor,
    renderer,
  };
}
