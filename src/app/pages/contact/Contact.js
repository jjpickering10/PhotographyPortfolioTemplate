import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { motion } from 'framer-motion';
import Image from '../home/Image';

gsap.registerPlugin(Observer);

export const homeContactVariant = {
  initial: ([location, state]) => ({
    translateX:
      (location === '/' && state === '/contact') ||
      (location === '/contact' && state === '/')
        ? '0rem'
        : '-32rem',
    translateY:
      (location === '/' && state === '/contact') ||
      (location === '/contact' && state === '/')
        ? '0rem'
        : '-11.2rem',
  }),
  exit: ([location, state]) => ({
    translateX:
      (location === '/' && state === '/contact') ||
      (location === '/contact' && state === '/') ||
      window.innerWidth <= 768
        ? '0rem'
        : '-32rem',
    translateY:
      (location === '/' && state === '/contact') ||
      (location === '/contact' && state === '/') ||
      window.innerWidth <= 768
        ? '0rem'
        : '-11.2rem',
    transition: {
      duration: 0.5,
      delay: 0.4,
      staggerChildren: 0.25,
    },
  }),
  animate: {
    translateX: '-0rem',
    translateY: '0rem',
    transition: {
      duration: 0.5,
      delay: 0.4,
      staggerChildren: 0.25,
    },
  },
};

export const scaleUp = {
  initial: {
    scale: 0.25,
    opacity: 0,
  },
  animate: (i) => ({
    scale: 1 - i * 0.25,
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0.4,
    },
  }),
  exit: (i) => ({
    scale: 1,
    opacity: 0,
    transition: {
      duration: 1,
    },
  }),
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.25,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const Contact = (props) => {
  const location = useLocation();

  // Images
  let imageArray = [];
  for (let i = 0; i < 4; i++) {
    const img = (
      <Image
        key={i.toString()}
        image={props.data.image}
        index={i}
        about={false}
        hover={props.hover}
        scaleUp={scaleUp}
        isContact={true}
      />
    );

    imageArray.push(img);
  }

  const linkElements = props.data.body.map((item) => {
    return (
      <a
        key={item.items[0].link_text}
        href={item.primary.link.url}
        target='_blank'
        rel='noreferrer'
        className='contact__titles__links__link'
      >
        {item.items[0].link_text}
      </a>
    );
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      exit='exit'
      initial='initial'
      animate='animate'
      className={'contact'}
    >
      <div key={'contact__wrapper'} className='contact__wrapper'>
        <div className='contact__titles'>
          <motion.div
            key={props.data.title}
            initial={{ translateY: '-100%', opacity: 0 }}
            animate={{ translateY: '0%', opacity: 1 }}
            exit={{ translateY: '-100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 1, delay: 1 }}
            className='contact__titles__title'
          >
            {props.data.title}
          </motion.div>
          <motion.div
            key={props.data.text}
            initial={{ translateY: '-100%', opacity: 0 }}
            animate={{ translateY: '0%', opacity: 1 }}
            exit={{ translateY: '-100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 1, delay: 1 }}
            className='contact__titles__text'
          >
            {props.data.text}
          </motion.div>
          <motion.div
            key={props.data.email}
            initial={{ translateY: '100%', opacity: 0 }}
            animate={{ translateY: '0%', opacity: 1 }}
            exit={{ translateY: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 1, delay: 1 }}
            className='contact__titles__email'
          >
            {props.data.email}
          </motion.div>
          <motion.div
            key={'contact-links'}
            initial={{ translateY: '100%', opacity: 0 }}
            animate={{ translateY: '0%', opacity: 1 }}
            exit={{ translateY: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 1, delay: 1 }}
            className='contact__titles__links'
          >
            {linkElements}
          </motion.div>
        </div>
        <motion.div
          key={'contact__images'}
          custom={[location.pathname, location.state]}
          variants={homeContactVariant}
          className='contact__images'
        >
          {imageArray}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
