import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import Main from './pages/Main';

function App() {



  return (
    <Router>
      <Routes>

        <Route exact path='/' element={<Registration/>} />(" ")
        <Route exact path='/Main' element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
