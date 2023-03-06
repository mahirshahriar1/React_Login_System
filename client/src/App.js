import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import Main from './pages/Main';

function App() {



  return (
    <Router>
      <Routes>

        <Route exact path='/registration' element={<Registration/>} />(" ")
        <Route exact path='/' element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
