import { useTexture, shaderMaterial, Html } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import glsl from 'babel-plugin-glsl/macro';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion } from 'framer-motion';

export default function GroupItem({
  image,
  scale,
  index,
  angle,
  radius,
  desc,
  returnToGallery,
}) {
  const rotateX = angle * index;
  const posY = Math.sin(angle * index) * (scale[1][1] / 2 + radius);
  const posZ = Math.cos(angle * index) * (scale[1][1] / 2 + radius);
  const texture = useTexture(image);
  if (index === 0 || index === 2) texture.flipY = false;
  texture.needsUpdate = true;
  const MyMaterial = shaderMaterial(
    {
      uTexture: texture,
      uProgress: 1,
      uScroll: 0,
      uScrollTwo: true,

      uSizeX: scale[1][0],
      uSizeY: window.innerHeight,
      uAlpha: index === 2 ? 1 : 0,
    },

    glsl`
    #define PI 3.1415926535897932384626433832795

    precision highp float;
    varying vec2 vUv;
    varying float vWave;
    uniform float uProgress;
    uniform float uSizeX;
    uniform float uSizeY;
    uniform float uAlpha;
    uniform float uScroll;
    uniform bool uScrollTwo;

    void main() {
    vUv = uv;
    vec3 newPos = position;
    float dist = length(0.5 - vUv);
    float waves = sin(vUv.y * 5. * (1.));
    newPos.z -= sin(dist * PI + PI / 2. + waves) * ((1.) * (10. * (1. - (1.))));
    
    if (uScrollTwo) {
      newPos.y -= sin(vUv.x * PI) * (uScroll * 2.);
    } else {
      newPos.y += sin(vUv.x * PI) * (uScroll * 2.);
    }
    vWave = sin(length(vUv - 0.5) * PI + PI / 2.);
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    viewPosition.z -= sin(viewPosition.y / uSizeX * PI + PI / 2.) * (1.);
    
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    }
    `,

    glsl`
     #define PI 3.1415926535897932384626433832795
    precision highp float;
varying vec2 vUv;
varying float vWave;
uniform sampler2D uTexture;
uniform float uAlpha;
uniform float uProgress;

void main() {
    float newWave = vWave;
  newWave *= 0.5;
  vec2 newUv = (vUv - 0.5) * (1. + (newWave * (1. - 1.) )) + 0.5;
  float square = smoothstep(0.5, 0.45, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  vec4 texture0 = texture2D(uTexture, newUv);
  gl_FragColor = texture0 * uAlpha * (square);
  

}

    `
  );

  extend({ MyMaterial });
  const ref = useRef();
  const materialRef = useRef();

  useEffect(() => {
    gsap.to(ref.current.material.uniforms.uAlpha, {
      value: 1,
      duration: 0.4,
    });
  }, []);

  return (
    <mesh
      ref={ref}
      scale={[[scale[1][0]], [scale[1][1]], 1]}
      position={[scale[3][0], posY, posZ]}
      rotation={[rotateX, 0, 0]}
      userData={index}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <myMaterial
        ref={materialRef}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
        transparent
      />
      <Html center>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className='gallery__section__info'
        >
          <div className='gallery__section__description'>{desc}</div>
        </motion.div>
      </Html>
    </mesh>
  );
}
