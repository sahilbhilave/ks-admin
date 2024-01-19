import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import '../Styles/AdminPage.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPosts = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Organic Farming');
  const [language, setLanguage] = useState('English');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [session, setSession] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [category, language]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, description, category')
        .eq('category', category)
        .eq('language', language);

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSubmit = () => {
    navigate('/post');
  };

  const handleDelete = (postId) => {
    setDeletePostId(postId);
    setDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', deletePostId);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeleteConfirmation(false);
      setDeletePostId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletePostId(null);
    setDeleteConfirmation(false);
  };

  const handleEdit = (postId) => {
    console.log(`Editing post with ID: ${postId}`);
    navigate(`/editpost?postId=${postId}`);
  };

  return (
    <div className="admin-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <button onClick={handleSubmit} type="submit">Create a new Post</button>
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
      {loadingPosts && (
        <div>
          <div className="loading">
            Loading <div className="spinner"></div>
          </div>
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          <p>Category: {post.category}</p>
          <div className="post-actions">
            <button
              className="delete-button"
              onClick={() => handleDelete(post.id)}
            >
              {deleteConfirmation && deletePostId === post.id ? (
                <div>
                  <div>Deleting Post</div>
                </div>
              ) : (
                'Delete'
              )}
            </button>
            <button className="edit-button" onClick={() => handleEdit(post.id)}>
              Edit
            </button>
          </div>
        </div>
      ))}

{deleteConfirmation && (
  <div className="modal-container">
    <div className="delete-modal">
      <p>Are you sure you want to delete this post?</p>
      <div className="modal-buttons">
        <button className="yes-button" onClick={handleDeleteConfirmation}>
          <i className="fas fa-check"></i> Yes
        </button>
        <button className="cancel-button" onClick={handleCancelDelete}>
          <i className="fas fa-times"></i> Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
    
  );
};

export default AdminPosts;
