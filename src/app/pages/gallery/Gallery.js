import { Canvas } from '@react-three/fiber';
import { useEffect, useReducer } from 'react';
import { motion } from 'framer-motion';
import Item from './Item';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import Group from './Group';
import calcScale from './calcScale';

export const GALLERY_ACTIONS = {
  HOVER: 'hover',
  END_HOVER: 'end-hover',
  CLICK_GROUP: 'click-group',
  GROUP_IS_ACTIVE: 'group-is-active',
  RETURN_TO_GALLERY: 'return-to-gallery',
  RETURN_TO_GALLERY_ANIMATION: 'return-to-gallery-animation',
  RETURN_TO_GALLERY_END: 'return-to-gallery-end',
};

const galleryReducer = (galleryState, { type, payload }) => {
  switch (type) {
    case GALLERY_ACTIONS.HOVER:
      return {
        ...galleryState,
        hover: true,
        hoverIndex: payload.index,
      };
    case GALLERY_ACTIONS.END_HOVER:
      return {
        ...galleryState,
        hover: false,
        hoverIndex: payload.index,
      };
    case GALLERY_ACTIONS.CLICK_GROUP:
      return {
        ...galleryState,
        hover: false,
        clicked: true,
        activeGroup: payload.index,
      };
    case GALLERY_ACTIONS.GROUP_IS_ACTIVE:
      return {
        ...galleryState,
        clicked: false,
        groupIsActive: true,
      };
    case GALLERY_ACTIONS.RETURN_TO_GALLERY:
      return {
        ...galleryState,
        returnToGallery: true,
      };
    case GALLERY_ACTIONS.RETURN_TO_GALLERY_ANIMATION:
      return {
        ...galleryState,
        groupIsActive: false,
        returnAnimation: true,
      };
    case GALLERY_ACTIONS.RETURN_TO_GALLERY_END:
      return {
        ...galleryState,
        hover: false,
        hoverIndex: 0,
        activeGroup: -1,
        groupIsActive: false,
        clicked: false,
        returnToGallery: false,
        returnAnimation: false,
      };

    default:
      break;
  }
};

gsap.registerPlugin(Observer);

const Gallery = (props) => {
  const [galleryState, galleryDispatch] = useReducer(galleryReducer, {
    hover: false,
    hoverIndex: 0,
    activeGroup: -1,
    groupIsActive: false,
    clicked: false,
    returnToGallery: false,
    returnAnimation: false,
  });

  let imageArray = [];
  for (let i = 0; i < 4; i++) {
    const imageElements = props.data.images.map((image) => {
      return (
        <Item
          key={i.toString() + 'item'}
          image={image.image}
          index={i}
          scale={calcScale(
            image.image.dimensions.width,
            image.image.dimensions.height,
            i
          )}
          imageTwo={props.data.gallery[i * 4].image}
          hovered={
            galleryState.hover && galleryState.hoverIndex === i ? true : false
          }
          category={props.data.gallery[i * 4].gallery_category}
          clicked={galleryState.clicked}
          galleryDispatch={galleryDispatch}
          activeGroup={galleryState.activeGroup}
          groupIsActive={galleryState.groupIsActive}
          returnToGallery={galleryState.returnToGallery}
          returnAnimation={galleryState.returnAnimation}
          dispatch={props.dispatch}
        />
      );
    });

    imageArray.push(imageElements);
  }

  const groups = [];
  const groupsObj = {};
  const groupElements = [];

  props.data.gallery.forEach((item) => {
    const cat = item.gallery_category;
    if (!groups.includes(cat)) {
      groups.push(cat);
      groupsObj[cat] = [];
    }
    groupsObj[cat].push(item);
  });

  for (const key in groupsObj) {
    if (groupsObj[key]) {
      groupElements.push(groupsObj[key]);
    }
  }
  const newGroups = groupElements.map((item, index) => {
    return (
      <>
        {galleryState.activeGroup === index && galleryState.groupIsActive && (
          <Group
            key={index.toString() + 'group'}
            images={item}
            category={item[0].gallery_category}
            galleryDispatch={galleryDispatch}
            returnToGallery={galleryState.returnToGallery}
            dispatch={props.dispatch}
          />
        )}
      </>
    );
  });

  useEffect(() => {
    document.body.style.height = '';
  }, []);

  return (
    <motion.div
      key='gallery__canvas'
      className='gallery__canvas'
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1 },
      }}
      exit={{
        clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        transition: { duration: 1, delay: 0.4 },
      }}
    >
      <Canvas
        key='canvas'
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 10] }}
      >
        {imageArray}
        {[...newGroups]}
      </Canvas>
    </motion.div>
  );
};

export default Gallery;
