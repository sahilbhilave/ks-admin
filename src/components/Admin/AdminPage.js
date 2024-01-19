import React, { useState } from 'react';
import AdminPosts from './AdminPosts'; // Import the AdminPosts component
import AdminWeather from './AdminWeather'; // Import the AdminWeather component
import { useNavigate } from 'react-router-dom';
import '../Styles/AdminPage.css';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('posts');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };


  return (
    <div className="admin-container">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h1 className="admin-header">Welcome to the Admin Page!</h1>

      <div className="tab-buttons">
        <button
          onClick={() => setSelectedTab('posts')}
          className={selectedTab === 'posts' ? 'active-tab' : ''}
        >
          Posts
        </button>
        <button
          onClick={() => setSelectedTab('weather')}
          className={selectedTab === 'weather' ? 'active-tab' : ''}
        >
          Weather
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === 'posts' && <AdminPosts />} {/* Render AdminPosts component */}
        {selectedTab === 'weather' && <AdminWeather />} {/* Render AdminWeather component */}
      </div>
    </div>
  );
};

export default AdminPage;
