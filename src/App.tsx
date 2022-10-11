import React, {memo, useEffect} from 'react';
import {ready} from './twa';

import {BackButton} from './components/sections/BackButton';
import {ThemeParams} from './components/sections/ThemeParams';
import {HapticFeedback} from './components/sections/HapticFeedback';
import {InitData} from './components/sections/InitData';
import {ThemeProvider} from './components/ThemeProvider';
import {User} from './components/sections/User';
import {Viewport} from './components/sections/Viewport';

import {Container, CssBaseline} from '@nextui-org/react';
import {MainButton} from './components/sections/MainButton';
import {Popup} from './components/sections/Popup';
import {WebApp} from './components/sections/WebApp';

/**
 * Main entry which renders the entire application.
 */
export const App = memo(() => {
  useEffect(() => {
    // Send native app notification about current Web App is ready to be
    // displayed.
    ready();
  }, []);

  const mb = {marginBottom: 8};

  return (
    <ThemeProvider>
      <CssBaseline/>
      <Container css={{padding: 16}} fluid>
        <User css={mb}/>
        <Viewport css={mb}/>
        <ThemeParams css={mb}/>
        <HapticFeedback css={mb}/>
        <InitData css={mb}/>
        <BackButton css={mb}/>
        <MainButton css={mb}/>
        <Popup css={mb}/>
        <WebApp/>
      </Container>
    </ThemeProvider>
  );
});

export default App;
