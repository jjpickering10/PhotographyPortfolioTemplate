import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Image from './Image';
import Titles from './Titles';

import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { motion } from 'framer-motion';

import { homeContactVariant, scaleUp } from '../contact/Contact';

gsap.registerPlugin(Observer);

const Home = (props) => {
  const location = useLocation();
  const homeRef = useRef(null);
  const [hide, setHide] = useState(false);
  const [about, setAbout] = useState(false);

  const imagesRef = useRef();

  const navigate = useNavigate();

  // Titles
  const titlesElements = (
    <Titles
      key={props.data.description}
      title={props.data.title.split(/\n/)[0]}
      span={props.data.title.split(/\n/)[1]}
      description={props.data.description}
      hide={hide}
    />
  );

  // Images
  let imageArray = [];
  for (let i = 0; i < 4; i++) {
    const imageElements = props.data.images.map((image) => {
      return (
        <Image
          key={image.image.url}
          image={image.image}
          index={i}
          hide={hide}
          about={false}
          moveToAbout={about}
          hover={props.hover}
          scaleUp={scaleUp}
          isContact={false}
        />
      );
    });

    imageArray.push(imageElements);
  }

  useEffect(() => {
    const myObserver = Observer.create({
      target: window, // can be any element (selector text is fine)
      type: 'wheel,touch', // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
      onStop: (self) => {
        if (self.deltaY < -5) {
          navigate('/gallery', { state: '/' });
        }
      },
      onStopDelay: 0.1,
      tolerance: 10,
      preventDefault: true,
      wheelSpeed: -1,
    });
    return () => {
      myObserver.kill();
    };
  }, [hide]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      exit='exit'
      initial='initial'
      animate='animate'
      ref={homeRef}
      className={'home'}
    >
      <div key={'home__wrapper'} className='home__wrapper'>
        <div className='home__titles'>{titlesElements}</div>
        <motion.div
          key={'home__images'}
          custom={[location.pathname, location.state]}
          variants={homeContactVariant}
          ref={imagesRef}
          className='home__images'
        >
          {imageArray}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
