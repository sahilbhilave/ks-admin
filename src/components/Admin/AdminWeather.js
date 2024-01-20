import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import WeatherEntryForm from './WeatherEntryForm';
import UpdateWeatherEntryForm from './UpdateWeatherEntryForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

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
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [postID,setPostId] = useState(null);


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
        .from('weather_data')
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
    setWeatherData([...weatherData, newEntry]);
    fetchWeatherData();
  };
  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}Z`);
    return time.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };
  const handleEdit = (postId) => {
    setPostId(postId);
    console.log("handleEdit"+postID);
    handleUpdateWeatherEntry();
  };

  const handleUpdateWeatherEntry = () => {
    setIsUpdateFormOpen(true);
  };

  const handleUpdateCloseForm = () => {
    setIsUpdateFormOpen(false);
  };

  

  return (
    <div className="admin-container">
      <div className='admin-form'>
        <button onClick={handleCreateWeatherEntry}>Create New Entry</button>
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

        <div key={entry.id} className="post-card">
          <div className="weather-info">
            <h3>{entry.tip}</h3>
            <p><span className="label">Temperature:</span> <strong>{entry.temperature}°C</strong></p>
  <p><span className="label">Sunrise:</span> <strong>{formatTime(entry.sunrise)}</strong></p>
  <p><span className="label">Sunset:</span> <strong>{formatTime(entry.sunset)}</strong></p>
  <p><span className="label">Wind Speed:</span> <strong>{entry.wind_speed} m/s</strong></p>
  <p><span className="label">Wind Direction:</span> <strong>{entry.wind_direction}</strong></p>
  <p><span className="label">Humidity:</span> <strong>{entry.humidity}%</strong></p>
  <p><span className="label">Weather:</span> <strong>{entry.weather}</strong></p>
  <p><span className="label">Rain Chances:</span> <strong>{entry.rain_chances}%</strong></p>
      {/* Add other attributes as needed */}

      
    </div>
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
          <FontAwesomeIcon icon={faTrash} />
        )}
      </button>

      <button className="edit-button" onClick={() => handleEdit(entry.id)}>
            <FontAwesomeIcon icon={faEdit} />
            </button>

            <p style={{color:'white'}} className='date'>{`Created At: ${new Date(entry.created_at).toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}`}</p>
    </div>
  </div>
))}
      {isCreateFormOpen && (
        <WeatherEntryForm
          onClose={handleCloseCreateForm}
          onWeatherEntryCreated={handleWeatherEntryCreated}
          fetchWeatherData={fetchWeatherData}
        />
      )}

{isUpdateFormOpen && (
        <UpdateWeatherEntryForm
        postID= {postID}
          onClose={handleUpdateCloseForm}
          onWeatherEntryCreated={handleUpdateWeatherEntry}
          fetchWeatherData={fetchWeatherData}
        />
      )}
      {deleteConfirmation && (
        <div className="modal-container">
          <div className="delete-modal">
            <p>Are you sure you want to delete this weather entry?</p>
            <div className="modal-buttons">
              <button className="yes-button" onClick={handleDeleteWeatherConfirmation}>
                Yes
              </button>
              <button className="cancel-button" onClick={handleCancelDeleteWeather}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWeather;
