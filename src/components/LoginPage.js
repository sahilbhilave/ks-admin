import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { RiMailLine, RiLockPasswordLine } from 'react-icons/ri';
import './Styles/LoginStyle.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null)
  const [logging, setlogging] = useState(false);

  const navigate = useNavigate();

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  //Check for authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
  }
  else {
    if(logging == false)
    navigate('/admin');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      setlogging(true);
      
      console.log('User logged in:', user);
      setError('');

      setTimeout(() => {
        setLoading(false);
        navigate('/admin');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error.message);
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-form-title">Kisan Sathi Admin</div>

        <div className="input-group">
          <label htmlFor="email" className="icon">
            <RiMailLine />
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="icon">
            <RiLockPasswordLine />
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading">
            <div className='loading-text'>Authenticating..</div>
            <div className='spinner'></div>
          </div>
        )}

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
