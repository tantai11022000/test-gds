import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import MenuApp from './components/MenuApp';
import MyRoutes from './routes';
const App = () => {
  return (
    <BrowserRouter>
      <MenuApp />
      <MyRoutes />
    </BrowserRouter>
  );
};

export default App;
