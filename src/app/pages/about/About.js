import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AboutImage from './AboutImage';
import useWindowSize from '../../hooks/useWindowSize';

gsap.registerPlugin(ScrollTrigger);

const Title = ({ title }) => {
  return <div className='about__title__title'>{title}</div>;
};

const Text = ({ text }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0.75 }}
      transition={{ duration: 0.4 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: false }}
      className='about__sections__section__text'
    >
      {text}
    </motion.div>
  );
};

const Section = ({ heading, index, image, texts }) => {
  const text = texts.map((item, idx) => {
    return <Text key={`${item.text} ${idx}`} text={item.text} />;
  });
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className='about__sections__section'
      data-index={index}
    >
      <div className='about__sections__section__heading'>{heading}</div>
      {text}
      <div className='about__images__image__wrapper'>
        <motion.img
          initial={{ scale: 2 }}
          transition={{ duration: 2 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false }}
          src={image}
          alt=''
          className='about__images__image'
          data-index={index}
        />
      </div>
    </motion.div>
  );
};

const About = (props) => {
  const location = useLocation();
  const containerRef = useRef(null);

  const size = useWindowSize();

  const scroll = {
    ease: 0.05,
    current: 0,
    previous: 0,
  };

  // Sections

  const sectionElements = props.data.body.map((section, i) => {
    return (
      <Section
        key={section.primary.image.url}
        heading={section.primary.heading}
        index={i}
        image={section.primary.image.url}
        texts={section.items}
      />
    );
  });

  useEffect(() => {
    document.body.style.height = `${
      containerRef.current.getBoundingClientRect().height
    }px`;
  }, [size.height]);

  useEffect(() => {
    const reqAnim = requestAnimationFrame(() => customScrolling());

    return () => {
      window.cancelAnimationFrame(reqAnim);
      document.body.style.height = '';
    };
  }, []);

  const customScrolling = () => {
    if (location.pathname !== '/about') return;
    scroll.current = window.scrollY;
    scroll.previous += (scroll.current - scroll.previous) * scroll.ease;
    scroll.rounded = Math.round(scroll.previous * 100) / 100;

    // Difference between
    const difference = scroll.current - scroll.rounded;
    const acceleration = difference / size.width;
    const velocity = +acceleration;
    const skew = velocity * 50;

    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(0, -${scroll.rounded}px, 0)`;
      containerRef.current.querySelector(
        '.about__title__title'
      ).style.transform = `skewY(${skew}deg)`;
    }

    requestAnimationFrame(() => {
      customScrolling();
    });
  };

  return (
    <>
      <div className='about'>
        <motion.div
          key={'about__background__image'}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 0.1,
            scale: 1.5,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className='about__background__image'
        >
          <AboutImage
            image={
              location.state === '/contact'
                ? props.contactData.image
                : props.homeData.images[0].image
            }
            index={0}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className='about__wrapper'
          ref={containerRef}
        >
          <div className='about__title'>
            <Title key={props.data.title} title={props.data.title} />
          </div>
          <div className={'about__sections'}>{sectionElements}</div>
        </motion.div>
      </div>
    </>
  );
};

export default About;
