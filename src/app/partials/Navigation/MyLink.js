import { NavLink, useLocation } from 'react-router-dom';

const MyLink = ({ text, dispatch }) => {
  const location = useLocation();

  return (
    <li className='navigation__list__item'>
      <NavLink
        to={`/${text.toLowerCase()}`}
        className={({ isActive }) => {
          return isActive
            ? 'navigation__list__link active'
            : 'navigation__list__link';
        }}
        state={location.pathname}
      >
        {text}
      </NavLink>
    </li>
  );
};

export default MyLink;
