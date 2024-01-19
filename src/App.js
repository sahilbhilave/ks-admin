import React from 'react';
import { BrowserRouter as Router,Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import AdminPage from './components/Admin/AdminPage';
import Post from './components/Posts/Post';
import EditPost from './components/Posts/EditPost';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/"  element={<LoginPage/>} />
          <Route path="/admin"  element={<AdminPage/>} />
          <Route path="/post"  element={<Post/>} />
          <Route path="/editpost"  element={<EditPost/>} />
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;