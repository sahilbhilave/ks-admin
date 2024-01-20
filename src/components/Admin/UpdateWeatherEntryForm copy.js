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

    const [time,setTime] = useState(null);
    const [temperature,setTemperature] = useState(null);
    const [sunrise,setSunrise] = useState(null);
    const [sunset,setSunset] = useState(null);
    const [wind_speed,setWindSpeed] = useState(null);
    const [wind_direction,setWindDirection] = useState(null);
    const [humidity,setHumidity] = useState(null);
    const [weather,setWeather] = useState(null);
    const [rain_chances,setRainChance] = useState(null);
    const [tip,setTip] = useState(null);

  
    useEffect(() => {
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
            console.log('Fetched data:', data);
            // Set state values
            setTime(data.time);
            setTemperature(data.temperature);
            setSunrise(data.sunrise);
            setSunset(data.sunset);
            setWindSpeed(data.wind_speed);
            setWindDirection(data.wind_direction);
            setHumidity(data.humidity);
            setWeather(data.weather);
            setRainChance(data.rain_chances);
            setTip(data.tip);
            // Set formData only if data is available
            setFormData(data || formData);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
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
        time: "" + time,
        sunrise:""+ sunrise,
        sunset: ""+sunset,
        temperature: parseFloat(temperature),
        wind_speed: parseFloat(wind_speed),
        wind_direction: wind_direction,
        humidity: humidity,
        weather: weather,
        tip: tip,
        rain_chances: rain_chances,
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
  <input
    type="time"
    name="time"
    value={time || ''}
    onChange={(e) => setTime(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label>Temperature:</label>
  <input
    type="text"
    name="temperature"
    value={temperature || ''}
    onChange={(e) => setTemperature(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label>Sunrise:</label>
  <input
    type="time"
    name="sunrise"
    value={sunrise || ''}
    onChange={(e) => setSunrise(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label>Sunset:</label>
  <input
    type="time"
    name="sunset"
    value={sunset || ''}
    onChange={(e) => setSunset(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label>Wind Speed:</label>
  <input
    type="text"
    name="wind_speed"
    value={wind_speed || ''}
    onChange={(e) => setWindSpeed(e.target.value)}
  />
</div>
</div>
<div className="form-column">
<div className="form-group">
  <label>Wind Direction:</label>
  <input
    type="text"
    name="wind_direction"
    value={wind_direction || ''}
    onChange={(e) => setWindDirection(e.target.value)}
  />
</div>

<div className="form-group">
  <label>Humidity:</label>
  <input
    type="text"
    name="humidity"
    value={humidity || ''}
    onChange={(e) => setHumidity(e.target.value)}
  />
</div>

<div className="form-group">
  <label>Weather:</label>
  <input
    type="text"
    name="weather"
    value={weather || ''}
    onChange={(e) => setWeather(e.target.value)}
  />
</div>

<div className="form-group">
  <label>Rain Chances:</label>
  <input
    type="text"
    name="rain_chances"
    value={rain_chances || ''}
    onChange={(e) => setRainChance(e.target.value)}
  />
</div>

<div className="form-group">
  <label>Tip:</label>
  <textarea
    name="tip"
    value={tip || ''}
    onChange={(e) => setTip(e.target.value)}
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
