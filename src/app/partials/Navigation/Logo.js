import { Link, useLocation } from 'react-router-dom';

const Logo = ({ text }) => {
  const location = useLocation();

  return (
    <Link to='/' className='navigation__link' state={location.pathname}>
      {text}
    </Link>
  );
};

export default Logo;
