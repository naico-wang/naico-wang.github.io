import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from './pages/Home/index'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/about" element='about' />
        <Route path="/dashboard" element='sdaf' />
        <Route path="*" element='' />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
