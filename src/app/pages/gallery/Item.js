import { useTexture, shaderMaterial, Html } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import glsl from 'babel-plugin-glsl/macro';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

import { GALLERY_ACTIONS } from './Gallery';
import { ACTIONS } from '../../App';

const Item = ({
  image,
  index,
  scale,
  imageTwo,
  hovered,
  category,
  clicked,
  galleryDispatch,
  activeGroup,
  groupIsActive,
  returnToGallery,
  returnAnimation,
  dispatch,
}) => {
  const texture = useTexture(image.url);
  const textureTwo = useTexture(imageTwo.url);
  texture.flipY = true;
  texture.needsUpdate = true;
  textureTwo.flipY = true;
  textureTwo.needsUpdate = true;
  const x =
    index === 0 ? 0 : index === 1 ? 0 : index === 2 ? 1 : index === 3 ? 1 : 0;
  const y =
    index === 0 ? 0 : index === 1 ? 1 : index === 2 ? 0 : index === 3 ? 1 : 0;

  const MyMaterial = shaderMaterial(
    {
      uTime: 0,
      uPoint: new THREE.Vector2(x, y),
      uTexture: texture,
      uTextureTwo: textureTwo,
      uProgress: 1,
      uProgressTwo: 0,
      uAlpha: 0,
      uScale: 1,
      uSizeX: scale[1][0],
    },
    // vertex shader
    glsl`
    #define PI 3.1415926535897932384626433832795

    precision highp float;
    uniform vec2 uPoint;
    uniform float uProgress;
    uniform float uProgressTwo;
    uniform float uTime;
    uniform float uAlpha;
    varying vec2 vUv;
    varying float vWave;
    uniform float uSizeX;

    void main() {
    vUv = uv;
    vec3 newPos = position;
    float dist = length(0.5 - vUv);
    float waves = sin(vUv.y * 5. * (uProgress + uProgressTwo));
    newPos.z -= sin(dist * PI + PI / 2. + waves) * ((uProgress + uProgressTwo) * (10. * (1. - (uProgress + uProgressTwo))));
    vWave = sin(length(vUv - 0.5) * PI + PI / 2.);
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    viewPosition.z -= sin(viewPosition.y / uSizeX * PI + PI / 2.) * (uAlpha);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    }
    `,
    // fragment shader
    glsl`
    precision highp float;
varying vec2 vUv;
varying float vWave;
uniform sampler2D uTexture;
uniform sampler2D uTextureTwo;
uniform float uAlpha;
uniform float uProgress;
uniform float uTime;
uniform float uScale;

void main() {
  float newWave = vWave;
  newWave *= 0.5;
  vec2 newUv = (vUv - 0.5) * (uScale + (newWave * (1. - uAlpha) )) + 0.5;
  vec4 texture0 = texture2D(uTexture, newUv);
  vec4 texture1 = texture2D(uTextureTwo, newUv);
  vec4 final = mix(texture1, texture0, uProgress);
  float square = smoothstep(0.5, 0.45, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  gl_FragColor = final * uAlpha * (square);

}

    `
  );

  extend({ MyMaterial });

  const ref = useRef();
  const materialRef = useRef();
  useFrame(({ clock }) => {
    if (groupIsActive || returnToGallery) return;
    ref.current.material.uniforms.uTime.value = clock.getElapsedTime();
    ref.current.scale.x = gsap.utils.mapRange(
      0,
      1,
      scale[0][0],
      scale[1][0],
      ref.current.material.uniforms.uProgress.value +
        ref.current.material.uniforms.uProgressTwo.value
    );
    ref.current.scale.y = gsap.utils.mapRange(
      0,
      1,
      scale[0][1],
      scale[1][1],
      ref.current.material.uniforms.uProgress.value +
        ref.current.material.uniforms.uProgressTwo.value
    );
    ref.current.position.x = gsap.utils.mapRange(
      0,
      1,
      scale[2][0],
      scale[3][0],
      ref.current.material.uniforms.uProgress.value +
        ref.current.material.uniforms.uProgressTwo.value
    );
    ref.current.position.y = gsap.utils.mapRange(
      0,
      1,
      scale[2][1],
      scale[3][1],
      ref.current.material.uniforms.uProgress.value +
        ref.current.material.uniforms.uProgressTwo.value
    );
  });

  useEffect(() => {
    if (returnToGallery) return;
    gsap.to(ref.current.material.uniforms.uProgress, {
      value: 0,
      duration: 1,
      ease: 'expo.out',
    });
    gsap.to(ref.current.material.uniforms.uProgressTwo, {
      value: 0,
      duration: 1,
      ease: 'expo.out',
    });
  }, [returnToGallery]);

  useEffect(() => {
    if (groupIsActive) {
      gsap.to(ref.current.scale, {
        x: scale[4][0],
        duration: 2,
        ease: 'expo.in',
      });
      gsap.to(ref.current.scale, {
        y: scale[4][1],
        duration: 2,
        ease: 'expo.in',
      });
      gsap.to(ref.current.material.uniforms.uAlpha, {
        value: 0.25,
        duration: 2,
        ease: 'expo.in',
      });
    }
  }, [groupIsActive]);

  useEffect(() => {
    gsap.to(materialRef.current.uniforms.uAlpha, {
      value: hovered ? 0.25 : 1,
      duration: 3,
      ease: 'expo.out',
    });
    gsap.to(materialRef.current.uniforms.uScale, {
      value: hovered ? 0.75 : 1,
      duration: 3,
      ease: 'expo.out',
    });
  }, [hovered]);

  useEffect(() => {
    if (clicked) {
      if (activeGroup !== index) {
        gsap.to(materialRef.current.uniforms.uAlpha, {
          value: 0,
          duration: 0.4,
          onComplete: () => {
            materialRef.current.visible = false;
          },
        });
      } else {
        gsap.killTweensOf(materialRef.current.uniforms.uAlpha);
        gsap.killTweensOf(materialRef.current.uniforms.uScale);
        const tl = gsap.timeline();
        tl.to(materialRef.current.uniforms.uAlpha, {
          value: 1,
          duration: 0.4,
        });
        tl.to(materialRef.current.uniforms.uScale, {
          value: 1,
          duration: 0.4,
        });
        tl.to(materialRef.current.uniforms.uProgressTwo, {
          value: 1,
          duration: 1,
          ease: 'expo.out',
        });
        tl.to(ref.current.position, {
          z: -1.852493976110715,
          duration: 1,
          ease: 'expo.out',
          onComplete: () => {
            galleryDispatch({
              type: GALLERY_ACTIONS.GROUP_IS_ACTIVE,
            });
          },
        });
      }
    } else if (returnToGallery && groupIsActive) {
      const currentRotation = ref.current.parent.children[4].rotation.x;
      const newRotation = currentRotation - (currentRotation % (Math.PI * 2));
      gsap.to(
        ref.current.parent.children[4].children[3].material.uniforms.uScroll,
        {
          value: 0,
          duration: 0.8,
        }
      );
      ref.current.parent.children[4].children.forEach((child, index) => {
        if (child.isMesh && index !== 3) {
          gsap.to(child.material.uniforms.uAlpha, {
            value: 0,
            duration: 0.6,
          });
        }
      });
      gsap.to(ref.current.parent.children[4].rotation, {
        x: newRotation,
        duration: 1,
        onComplete: () => {
          gsap.set(ref.current.scale, {
            x: scale[1][0],
          });
          gsap.set(ref.current.scale, {
            y: scale[1][1],
          });
          gsap.set(ref.current.material.uniforms.uAlpha, {
            value: 1,
          });
          setTimeout(() => {
            galleryDispatch({
              type: GALLERY_ACTIONS.RETURN_TO_GALLERY_ANIMATION,
            });
          }, 400);
        },
      });
    } else if (returnAnimation) {
      gsap.to(ref.current.position, {
        z: 0,
        duration: 0.4,
        onComplete: () => {
          if (materialRef.current.visible === false) {
            materialRef.current.uniforms.uAlpha.value = 0;
            materialRef.current.visible = true;
          }
          gsap.to(materialRef.current.uniforms.uAlpha, {
            value: 1,
            duration: 0.4,
          });
          galleryDispatch({
            type: GALLERY_ACTIONS.RETURN_TO_GALLERY_END,
          });
        },
      });
    }
  }, [clicked, returnToGallery, returnAnimation]);

  return (
    <mesh
      onPointerDown={() => {
        if (groupIsActive || returnToGallery) return;
        galleryDispatch({
          type: GALLERY_ACTIONS.CLICK_GROUP,
          payload: {
            index: index,
          },
        });
        dispatch({
          type: ACTIONS.GALLERY_ACTIVE,
        });
      }}
      ref={ref}
      onPointerEnter={() => {
        if (groupIsActive || returnToGallery) return;
        galleryDispatch({
          type: GALLERY_ACTIONS.HOVER,
          payload: {
            index: index,
          },
        });
      }}
      onPointerLeave={() => {
        if (groupIsActive || returnToGallery) return;
        galleryDispatch({
          type: GALLERY_ACTIONS.END_HOVER,
          payload: {
            index: index,
          },
        });
      }}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <myMaterial
        ref={materialRef}
        depthTest={false}
        depthWrite={false}
        transparent
      />
      <Html zIndexRange={[-1, 0]} wrapperClass={category}>
        <div
          className={`gallery__section__info__category ${
            clicked || groupIsActive ? 'hide' : ''
          }`}
        >
          <div className='gallery__section__description__category'>
            {category}
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export default Item;
