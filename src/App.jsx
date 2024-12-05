import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WeatherInformations from './components/WeatherInformations/WeatherInformations';
import WeatherInformations5Days from './components/WeatherInformations5Days/WeatherInformations5Days';
import './App.css';


function App() {

  const [weather, setWeather] = useState();
  const [weather5Days, setWeather5Days] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const inputRef = useRef();
  const key = "dbf582a683f39b9b49f68c5d8d132f28";

  async function fetchWeatherByCoordinates(lat, lon) {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=pt_br&units=metric`;
    const url5Days = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&lang=pt_br&units=metric`;


    try {

      const apiInfo = await axios.get(url);
      const apiInfo5Days = await axios.get(url5Days);

      setWeather(apiInfo.data);
      setWeather5Days(apiInfo5Days.data);

    } catch (error) {
      setErrorMessage("Erro ao buscar os dados do tempo.");
    }

  }

  function getLocation() {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        () => {
          setErrorMessage("Não foi possível obter sua localização.");
        }

      );

    } 
    else {
      setErrorMessage("Geolocalização não encontrada.");
    }

  }


  useEffect(() => {

    getLocation();

  }, []);


  async function searchCity() {

    setErrorMessage();
    const city = inputRef.current.value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`;
    const url5Days = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=pt_br&units=metric`;


    try {

      const apiInfo = await axios.get(url);
      const apiInfo5Days = await axios.get(url5Days);

      setWeather(apiInfo.data);
      setWeather5Days(apiInfo5Days.data);

    } 
    catch (error) {

      setErrorMessage("Por favor, preencha o input com uma cidade existente.");
      setWeather();
      setWeather5Days();

    }

  }


  return (

    <div className='container'>

      <h1>DevClub Previsão do Tempo</h1>
      <input ref={inputRef} type="text" placeholder='Digite o nome da cidade'/>
      <button onClick={searchCity}>Buscar</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {weather && <WeatherInformations weather={weather} />}
      {weather5Days && <WeatherInformations5Days weather5Days={weather5Days}/>}

    </div>

  );

}


export default App;