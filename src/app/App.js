import { useSinglePrismicDocument } from '@prismicio/react';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Navigation from './partials/Navigation/Navigation';
import Loader from './partials/loader/Loader';
import Gallery from './pages/gallery/Gallery';
import { useEffect, useReducer, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Contact from './pages/contact/Contact';
import gsap from 'gsap';

export const ACTIONS = {
  CHANGE_MODE: 'change-mode',
  LOADED: 'loaded',
  GALLERY_ACTIVE: 'gallery-active',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.CHANGE_MODE:
      if (
        (payload.from === '/' && payload.to === '/gallery') ||
        (payload.from === '/about' && payload.to === '/gallery') ||
        (payload.from === '/gallery' && payload.to === '/about') ||
        (payload.from === '/contact' && payload.to === '/gallery') ||
        (payload.from === '/contact' && payload.to === '/') ||
        (payload.from === '/' && payload.to === '/contact')
      ) {
        return {
          ...state,
          mode: 'wait',
        };
      } else {
        return {
          ...state,
          mode: 'sync',
        };
      }
    case ACTIONS.GALLERY_ACTIVE:
      return {
        ...state,
        gallery_active: !state.gallery_active,
      };
    case ACTIONS.LOADED:
      return {
        ...state,
        loaded: true,
      };
    default:
      break;
  }
};

const App = () => {
  const [home] = useSinglePrismicDocument('home');
  const [about] = useSinglePrismicDocument('about');
  const [contact] = useSinglePrismicDocument('contact');
  const [navigation] = useSinglePrismicDocument('navigation');
  const location = useLocation();
  const loaderRef = useRef(null);
  const numberRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, {
    mode: 'sync',
    gallery_active: false,
    loaded: false,
  });

  useEffect(() => {
    if (!state.loaded) return;
    dispatch({
      type: ACTIONS.CHANGE_MODE,
      payload: {
        from: location.state,
        to: location.pathname,
      },
    });
  }, [location.pathname, location.state, state.loaded]);

  const animateLoader = () => {
    const tl = gsap.timeline();
    const total = { time: 0, colorG: 255, colorB: 255 };
    tl.to(total, {
      time: 100,
      colorG: 188,
      colorB: 17,
      duration: 2,
      onUpdate: () => {
        numberRef.current.innerText = `${total.time.toFixed(0)} %`;
        numberRef.current.style.color = `rgba(255, ${total.colorG}, ${total.colorB}, 1)`;
      },
      onComplete: () => {
        dispatch({
          type: ACTIONS.LOADED,
        });
      },
    });
    tl.to(loaderRef.current, {
      translateY: '100%',
      duration: 1.75,
      delay: 0.25,
      onComplete: () => {
        loaderRef.current.style.display = 'none';
      },
    });
  };

  useEffect(() => {
    if (home && about && contact && navigation) {
      setTimeout(() => {
        animateLoader();
      }, 1000);
    }
  }, [home, about, contact, navigation]);

  return (
    <>
      <Loader loaderRef={loaderRef} numberRef={numberRef} />
      {state.loaded && about && home && navigation && contact && (
        <Navigation
          data={navigation.data}
          page={location.pathname}
          galleryActive={state.gallery_active}
        />
      )}
      <AnimatePresence
        mode={state.mode}
        initial={false}
        custom={[location.pathname, location.state]}
      >
        {state.loaded && about && home && navigation && contact && (
          <Routes location={location} key={location.pathname}>
            <Route
              exact
              path='/'
              element={
                about &&
                home &&
                navigation &&
                contact && <Home data={home.data} />
              }
            ></Route>

            <Route
              exact
              path='/gallery'
              element={
                state.loaded &&
                about &&
                home &&
                navigation &&
                contact && <Gallery data={home.data} dispatch={dispatch} />
              }
            ></Route>
            <Route
              exact
              path='/about'
              element={
                state.loaded &&
                about &&
                home &&
                navigation &&
                contact && (
                  <About
                    data={about.data}
                    homeData={home.data}
                    contactData={contact.data}
                  />
                )
              }
            ></Route>
            <Route
              exact
              path='/contact'
              element={
                state.loaded &&
                about &&
                home &&
                navigation &&
                contact && <Contact data={contact.data} />
              }
            ></Route>
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
