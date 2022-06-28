precision mediump float;

uniform bool grey_scale;
uniform sampler2D texture;
uniform vec2 mouse_position;
uniform float filter_selected;
uniform vec2 u_resolution;

varying vec2 texcoords2;

vec3 lumaFunction() {

  vec4 color = texture2D(texture, texcoords2);
  
  vec2 st = gl_FragCoord.xy; 
  vec2 mouse = vec2(mouse_position.x, 500.0 - mouse_position.y);

  if(distance(st,mouse)< 150.0){
    vec4 color = texture2D(texture, vec2((1.0- mouse.x/700.0) + (texcoords2.x - mouse.x/700.0)*0.3,(1.0- mouse.y/500.0) + (texcoords2.y - mouse.y/500.0)*0.3));
    float r = color.r;
    float g = color.g;
    float b = color.b;

    float V;
     
    if (filter_selected == 1.0){
      V = dot(color.rgb, vec3(0.5,0.5,0.3));
    }

    vec3 result = vec3(V);
    if (filter_selected == 1.0){
     
    }else{
      result.r = r;
      result.g = g;
      result.b = b;
    }

    
    return result;

  }else{

    vec4 color = texture2D(texture, texcoords2);

    float r = color.r;
    float g = color.g;
    float b = color.b;

    return (vec3(r,g,b));
  }

}

void main() {

  gl_FragColor = vec4(lumaFunction(), 1.0);

}