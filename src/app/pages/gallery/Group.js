import calcScale from './calcScale';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Observer from 'gsap/Observer';
import GroupItem from './GroupItem';
import { GALLERY_ACTIONS } from './Gallery';
import { ACTIONS } from '../../App';

export default function Group({
  images,
  category,
  galleryDispatch,
  returnToGallery,
  dispatch,
}) {
  const groupRef = useRef();
  let target = 0;
  let current = 0;
  let direction = true;
  useFrame(() => {
    current *= 0.98;
    if (groupRef.current && !returnToGallery) {
      groupRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          child.material.uniforms.uScrollTwo.value = direction;
        }
        if (!direction && child.type === 'Mesh') {
          if (index === 3 || index === 5) {
            child.material.uniforms.uScroll.value = current * 0.0005;
          } else {
            child.material.uniforms.uScroll.value = -current * 0.0005;
          }
        } else if (direction && child.type === 'Mesh') {
          if (index === 3 || index === 5) {
            child.material.uniforms.uScroll.value = -current * 0.0005;
          } else {
            child.material.uniforms.uScroll.value = current * 0.0005;
          }
        }
      });
      groupRef.current.rotation.x -= current * 0.0005;
    }
  });
  const groupImages = images.map((item, index) => {
    const length = images.length;
    return (
      <GroupItem
        key={index.toString() + 'groupitem'}
        image={item.image.url}
        scale={calcScale(
          item.image.dimensions.width,
          item.image.dimensions.height,
          index
        )}
        index={
          index + length / 2 >= length
            ? index + length / 2 - length
            : index + length / 2
        }
        angle={(2 * Math.PI) / length}
        radius={1}
        desc={item.gallery_description}
        returnToGallery={returnToGallery}
      />
    );
  });
  const handleScroll = (e, upDirection) => {
    target = e;
    direction = upDirection;
    current = gsap.utils.interpolate(current, target, 0.1);
  };
  useEffect(() => {
    const myObserver = Observer.create({
      target: window,
      type: 'wheel,touch',
      onUp: (e) => {
        handleScroll(e.deltaY, true);
      },
      onDown: (e) => {
        handleScroll(e.deltaY, false);
      },
      tolerance: 10,
      preventDefault: true,
      wheelSpeed: -1,
    });

    return () => {
      myObserver.kill();
    };
  }, []);

  return (
    <group position={[0, 0, 5]} ref={groupRef}>
      <Html center zIndexRange={[-1, 0]}>
        <div
          style={{
            transform: 'translate(-33vw, 0) rotate(-90deg)',
          }}
          className={`gallery__section__category ${
            returnToGallery ? 'hide' : ''
          }`}
        >
          {category}
        </div>
      </Html>
      <Html center zIndexRange={[-1, 0]}>
        <div
          style={{
            color: 'white',
            transform: 'translate(33vw, 0) rotate(90deg)',
          }}
          className={`gallery__section__category ${
            returnToGallery ? 'hide' : ''
          }`}
        >
          {category}
        </div>
      </Html>
      <Html fullscreen>
        <div
          className={`gallery__back__wrapper ${returnToGallery ? 'hide' : ''}`}
        >
          <button
            onClick={() => {
              galleryDispatch({
                type: GALLERY_ACTIONS.RETURN_TO_GALLERY,
              });
              dispatch({
                type: ACTIONS.GALLERY_ACTIVE,
              });
            }}
            className='gallery__back__text'
          >
            &larr; Back
          </button>
        </div>
      </Html>
      {groupImages}
    </group>
  );
}
