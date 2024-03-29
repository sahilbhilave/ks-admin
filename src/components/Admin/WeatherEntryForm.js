import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../Styles/WeatherForm.css';
import { useNavigate,useLocation } from 'react-router-dom';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const WeatherEntryForm = ({ onClose, onWeatherEntryCreated, fetchWeatherData }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    temperature: '',
    sunrise: '',
    sunset: '',
    wind_speed: '',
    wind_direction: '',
    humidity: '',
    weather: '',
    rain_chances: '',
    tip: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = formatDate(formData.date);
      const formattedTime = formatTime(formData.time);
      const formattedSunrise = formatTime(formData.sunrise);
      const formattedSunset = formatTime(formData.sunset);
      
      // console.log("Date"+formattedDate);
      // console.log("Time"+formattedTime);
      // console.log("Date"+formattedSunrise);
      // console.log("Time"+formattedSunset);
      // console.log("Date"+formData.temperature);
      // console.log("Time"+formData.wind_speed);
      // console.log("Date"+formData.wind_direction);
      // console.log("Time"+formData.humidity);
      // console.log("Time"+formData.weather);
      // console.log("Time"+formData.tip);
      // console.log("Time"+formData.rain_chances);

      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id;
      const numericFormData = {
        ...formData,
        date: ""+formattedDate,
        time: ""+formattedTime,
        sunrise: formattedSunrise,
        sunset: formattedSunset,
        temperature: parseFloat(formData.temperature),
        wind_speed: parseFloat(formData.wind_speed),
        wind_direction: formData.wind_direction,
        humidity: formData.humidity,
        weather: formData.weather,
        tip: formData.tip,
        rain_chances: formData.rain_chances,
        user_id: userId
      };

      const { data, error } = await supabase.from('weather_data').upsert([numericFormData]);

      if (error) {
        console.error('Error creating weather entry:', error);
      } else {
        onClose();
        fetchWeatherData(); 
      }

    } catch (error) {
      console.error('Error creating weather entry:', error);
    }
  };

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (inputTime) => {
    const [hour, minute] = inputTime.split(':');
    return `${hour}:${minute}`;
  };

  return (
    <div className="back">
      <div id='container' className="weather-entry-form">
        <div className='heading'>
          <h3>Create New Weather Entry</h3>
          <button className='cancel' onClick={onClose}>Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label>Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Time:</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Temperature:</label>
                <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Sunrise:</label>
                <input type="time" name="sunrise" value={formData.sunrise} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Sunset:</label>
                <input type="time" name="sunset" value={formData.sunset} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Wind Speed:</label>
                <input type="text" name="wind_speed" value={formData.wind_speed} onChange={handleChange} />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Wind Direction:</label>
                <input type="text" name="wind_direction" value={formData.wind_direction} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Humidity:</label>
                <input type="text" name="humidity" value={formData.humidity} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Weather:</label>
                <input type="text" name="weather" value={formData.weather} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Rain Chances:</label>
                <input type="text" name="rain_chances" value={formData.rain_chances} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Tip:</label>
                <textarea
                  name="tip"
                  value={formData.tip}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              <button className='submit' type="submit">Submit</button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default WeatherEntryForm;
