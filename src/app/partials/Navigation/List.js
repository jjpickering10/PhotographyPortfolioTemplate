import MyLink from './MyLink';
const List = ({ list, dispatch }) => {
  const linkElements = list.map((link) => {
    return <MyLink key={link.text} text={link.text} dispatch={dispatch} />;
  });
  return <ul className='navigation__list'>{linkElements}</ul>;
};

export default List;
