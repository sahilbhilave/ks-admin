// AdminPage.js
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './Styles/AdminPage.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState('');
  const [category, setCategory] = useState('Organic Farming');
  const [language, setLanguage] = useState('English');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [category, language]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', category)
        .eq('language', language);

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    navigate('/createblog');
  };

  const handleDelete = async (postId) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (postId) => {
    console.log(`Editing post with ID: ${postId}`);
  };

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
      
      <form onSubmit={handleSubmit} className="admin-form">
        {/* Form input fields... */}
        <button type="submit">Create a new Post</button>
      </form>

      <div className="category-container">
        <label htmlFor="language">Select Language</label>
        <select
          id="language"
          className="category-dropdown"  // You can keep the same style for both dropdowns
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
          <option value="Tamil">Tamil</option>
        </select>
      </div>

      <div className="category-container">
        <label htmlFor="category">Select Category</label>
        <select
          id="category"
          className="category-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Organic Farming">Organic Farming</option>
          <option value="Animal husbandry">Animal husbandry</option>
          <option value="Nourishment garden">Nourishment garden</option>
          <option value="Food processing">Food processing</option>
        </select>
      </div>


      <div className="existing-posts">
        <h2>Existing Posts ({posts.length})</h2>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>Category: {post.category}</p>
            <div className="post-actions">
              <button className="delete-button" onClick={() => handleDelete(post.id)}>
                Delete
              </button>
              <button className="edit-button" onClick={() => handleEdit(post.id)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;