import { motion } from 'framer-motion';

const Image = ({
  image,
  index,
  hide,
  about,
  moveToAbout,
  hover,
  scaleUp,
  isContact,
}) => {
  return (
    <motion.div
      key={`${index.toString()}-${
        isContact ? 'contact' : 'home'
      }__images__image__wrapper`}
      variants={scaleUp}
      custom={index}
      className={`${
        isContact
          ? 'contact__images__image__wrapper'
          : 'home__images__image__wrapper'
      }`}
      data_index={index}
    >
      <img
        key={`${index.toString()}-${
          isContact ? 'contact' : 'home'
        }__images__image`}
        className={`${
          isContact ? 'contact__images__image' : 'home__images__image'
        }`}
        data_index={index}
        src={image.url}
        alt={image.alt}
      ></img>
    </motion.div>
  );
};

export default Image;
