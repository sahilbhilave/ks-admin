import React from 'react';
import { BrowserRouter as Router,Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
// import About from './components/About';
// import Contact from './components/Contact';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/"  element={<LoginPage/>} />
          <Route path="/admin"  element={<AdminPage/>} />
          {/* <Route path="/about" element={About} /> */}
          {/* <Route path="/contact" element={Contact} /> */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;