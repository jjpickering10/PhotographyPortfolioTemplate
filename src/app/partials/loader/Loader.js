import React from 'react';

const Loader = (props) => {
  return (
    <div ref={props.loaderRef} className='loader'>
      <div ref={props.numberRef} className='loader__number'>
        0 %
      </div>
    </div>
  );
};

export default Loader;
