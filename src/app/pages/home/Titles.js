import { motion } from 'framer-motion';

const Titles = ({ title, description, span, hide }) => {
  return (
    <div className='home__titles__title__wrapper'>
      <div className='home__titles__title__wrapper'>
        <motion.div
          key={title}
          initial={{ translateY: '-100%', opacity: 0 }}
          animate={{ translateY: '0%', opacity: 1 }}
          exit={{ translateY: '-100%', opacity: 0 }}
          transition={{ type: 'tween', duration: 1, delay: 1 }}
          className='home__titles__title'
        >
          {title} <br />
          <span>{span}</span>
        </motion.div>
      </div>
      <div className='home__titles__description__wrapper'>
        <motion.div
          key={title}
          initial={{ translateY: '100%', opacity: 0 }}
          animate={{ translateY: '0%', opacity: 1 }}
          exit={{ translateY: '100%', opacity: 0 }}
          transition={{ type: 'tween', duration: 1, delay: 1 }}
          className='home__titles_description'
        >
          {description}
        </motion.div>
      </div>
    </div>
  );
};

export default Titles;
