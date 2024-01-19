import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import WeatherEntryForm from './WeatherEntryForm';

import '../Styles/AdminPage.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminWeather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteWeatherId, setDeleteWeatherId] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const { data, error } = await supabase.from('weather_data').select('*');

      if (error) {
        console.error('Error fetching weather data:', error);
      } else {
        setWeatherData(data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleDeleteWeather = (weatherId) => {
    setDeleteWeatherId(weatherId);
    setDeleteConfirmation(true);
  };

  const handleDeleteWeatherConfirmation = async () => {
    try {
      const { error } = await supabase
        .from('weather')
        .delete()
        .eq('id', deleteWeatherId);

      if (error) {
        console.error('Error deleting weather entry:', error);
      } else {
        fetchWeatherData();
      }
    } catch (error) {
      console.error('Error deleting weather entry:', error);
    } finally {
      setDeleteConfirmation(false);
      setDeleteWeatherId(null);
    }
  };

  const handleCancelDeleteWeather = () => {
    setDeleteWeatherId(null);
    setDeleteConfirmation(false);
  };

  const handleCreateWeatherEntry = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const handleWeatherEntryCreated = (newEntry) => {
    // Handle the newly created weather entry, e.g., update the state
    setWeatherData([...weatherData, newEntry]);
  };

  return (
    <div className="admin-container">
        <div className='admin-form'>
         <button onClick={handleCreateWeatherEntry}>
        Create New Entry
      </button>
      </div>
      <h2>Weather Entries ({weatherData.length})</h2>
      {loadingWeather && (
        <div>
          <div className="loading">
            Loading <div className="spinner"></div>
          </div>
        </div>
      )}
      {weatherData.map((entry) => (
        <div key={entry.id} className="weather-card">
          {/* Display weather information here */}
          <p>{`Temperature: ${entry.temperature}`}</p>
          {/* Display other weather attributes as needed */}
          <div className="weather-actions">
            <button
              className="delete-button"
              onClick={() => handleDeleteWeather(entry.id)}
            >
              {deleteConfirmation && deleteWeatherId === entry.id ? (
                <div>
                  <div>Deleting Entry</div>
                </div>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      ))}
     

      {isCreateFormOpen && (
        <WeatherEntryForm onClose={handleCloseCreateForm} onWeatherEntryCreated={handleWeatherEntryCreated} />
      )}

      {deleteConfirmation && (
  <div className="modal-container">
    <div className="delete-modal">
      <p>Are you sure you want to delete this post?</p>
      <div className="modal-buttons">
        <button className="yes-button" onClick={handleDeleteWeatherConfirmation}>
          <i className="fas fa-check"></i> Yes
        </button>
        <button className="cancel-button" onClick={handleCancelDeleteWeather}>
          <i className="fas fa-times"></i> Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>

    
  );
};

export default AdminWeather;
