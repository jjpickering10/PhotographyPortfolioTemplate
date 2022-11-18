import React from 'react';

function AboutImage({ image, index }) {
  return (
    <div
      className='about__background__image__image__wrapper'
      data_index={index}
    >
      <img
        className='about__background__image__image'
        data_index={index}
        src={image.url}
        alt={image.alt}
      ></img>
    </div>
  );
}

export default AboutImage;
