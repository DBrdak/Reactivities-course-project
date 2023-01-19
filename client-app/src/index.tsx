import ReactDOM from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css'
import './App/layout/styles.css';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './App/stores/store';
import { RouterProvider } from 'react-router-dom';
import { router } from './App/router/Routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
      <RouterProvider router={router} />
  </StoreContext.Provider>
  //<React.StrictMode>
    
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
