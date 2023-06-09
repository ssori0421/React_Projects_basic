import { useEffect, useState, useCallback } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherBox from './component/WeatherBox';
import ButtonBox from './component/ButtonBox';

// 1. 앱이 실행되자 마자 현재위치 기반의 날씨가 보인다
// 2. 날씨 상태 정보에는 도시, 섭씨, 화씨
// 3. 5개의 버튼(1개는 현재 위치, 4개는 다른 도시)
// 4. 도시 버튼을 클릭하면 도시별 날씨가 나옴
// 5. 현재위치 버튼을 누르면 다시 현재위치 기반의 날씨가 나옴
// 6. 로딩 스피너

function App() {
  const [weather, setWeather] = useState(null); // weather 데이터를 넣을 state 만들기
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false); // loading 값이 true 일 때에만 로딩스피너가 보이게 됨
  const cities = ['paris', 'new york', 'tokyo', 'seoul'];

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      getWeatherByCurrentLocation(lat, lon); // lat, lon을 인자로 넘겨주면서 getWeatherByCurrentLocation 함수를 호출
    });
  }, []);

  const getWeatherByCurrentLocation = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e919bb3b5b58a2b3ce50ef98fb148e5a&units=metric`;
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setWeather(data); // weather state에 데이터를 넣어줘
    setLoading(false);
  }; // getWeatherByCurrentLocation 함수는 lat, lon을 매개변수로 넘겨받아 url을 생성하는 작업을 함

  const getWeatherByCity = useCallback(async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e919bb3b5b58a2b3ce50ef98fb148e5a&units=metric`;
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setWeather(data); // weather state에 데이터를 넣어줘
    setLoading(false);
  }, [city]);

  useEffect(() => {
    if (city === '') {
      getCurrentLocation();
    } else {
      getWeatherByCity();
    }
  }, [city, getCurrentLocation, getWeatherByCity]);

  return (
    <div className='weatherContainer'>
      <WeatherBox weather={weather} loading={loading} />
      <ButtonBox cities={cities} setCity={setCity} />
    </div>
  );
}

export default App;
