import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App.js';

import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();


// const render = Component => {
//     ReactDOM.render(
//       <AppContainer>
//         <Component />
//       </AppContainer>,
//       document.getElementById('root')
//     )
//   }
  
//   render(App)
    
//   if (module.hot) {
//     module.hot.accept('./App', () => { render(App) })
//   }
    
//   registerServiceWorker();

  
const rootEl = document.getElementById('root');

ReactDOM.render(
    <AppContainer>
        <App />
    </AppContainer>,
    rootEl
);

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default; // eslint-disable-line global-require
        ReactDOM.render(
            <AppContainer>
                <NextApp />
            </AppContainer>,
            rootEl
        );
    });
}