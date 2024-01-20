import React, { useEffect,useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../Styles/WeatherForm.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UpdateWeatherEntryForm = ({ postID,onClose, onWeatherEntryCreated, fetchWeatherData }) => {

 

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

  useEffect(() => {

    console.log("ASDASD"+postID);
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('weather_data')
          .select('*')
          .eq('id', postID)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
        } else {
          setFormData(data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postID]);

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split('-');
    return `${day}/${month}/${year}`;
  };
  
  const formatTime = (inputTime) => {
    const [hour, minute] = inputTime.split(':');
    return `${hour}:${minute}`;
  };
  
  const formatTime24 = (inputTime) => {
    const [hour, minute] = inputTime.split(':');
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
    const formattedTime = formatTime(formData.time);
    const formattedSunrise = formatTime(formData.sunrise);
    const formattedSunset = formatTime(formData.sunset);

  
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      const numericFormData = {
        time: "" + formattedTime,
        sunrise:""+ formattedSunrise,
        sunset: ""+formattedSunset,
        temperature: parseFloat(formData.temperature),
        wind_speed: parseFloat(formData.wind_speed),
        wind_direction: formData.wind_direction,
        humidity: formData.humidity,
        weather: formData.weather,
        tip: formData.tip,
        rain_chances: formData.rain_chances,
        user_id: userId,
      };
  
      const { error } = await supabase
        .from('weather_data')
        .update(numericFormData)
        .eq('id', postID);
  
      if (error) {
        console.error('Error updating weather entry:', error);
      } else {
        onClose();
        console.log("Bazinga");
        fetchWeatherData();
      }
    } catch (error) {
      console.error('Error updating weather entry:', error);
    }
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
              {/* <div className="form-group">
                <label>Date:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div> */}

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
              <button className='submit' type="submit">Update</button>
            </div>
           
          </div>
         
        </form>
      </div>
    </div>
  );
};

export default UpdateWeatherEntryForm;
