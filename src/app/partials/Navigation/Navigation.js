import Scroll from './Scroll';
import Logo from './Logo';
import List from './List';
const Navigation = ({ data, page, galleryActive }) => {
  return (
    <div className='navigation'>
      <Logo text={data.logo_text} />
      <List list={data.list} />
      <Scroll
        text={
          page === '/gallery' && !galleryActive
            ? 'click images'
            : page === '/contact'
            ? ''
            : 'scroll'
        }
      />
    </div>
  );
};

export default Navigation;
