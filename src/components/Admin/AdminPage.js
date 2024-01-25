import React, { useEffect,useState } from 'react';
import AdminPosts from './AdminPosts'; 
import AdminWeather from './AdminWeather'; 
import MarketProducts from '../Market/MarketProducts';
import { useNavigate,useLocation } from 'react-router-dom';
import '../Styles/AdminPage.css';
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('posts');
  const [session, setSession] = useState(null);
  const location = useLocation();

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/');
      } 
    });
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  
    return () => subscription.unsubscribe();
  }, []);


  return (
    <div className="admin-container">
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout <FontAwesomeIcon icon={faSignOut} />
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

        <button
          onClick={() => setSelectedTab('market')}
          className={selectedTab === 'market' ? 'active-tab' : ''}
        >
          Market
        </button>
        <button
          onClick={() => setSelectedTab('tourism')}
          className={selectedTab === 'tourism' ? 'active-tab' : ''}
        >
          Tourism
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === 'posts' && <AdminPosts />} 
        {selectedTab === 'weather' && <AdminWeather />} 
        {selectedTab === 'market' && <MarketProducts />} 
        {selectedTab === 'tourism' && <AdminWeather />} 
      </div>
    </div>
  );
};

export default AdminPage;
