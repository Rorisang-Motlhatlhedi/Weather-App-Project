const apiKey = "bd5f74ebd2d518f1668e012a3ca33b7b";

// 🌙 Theme toggle
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};

// 📍 Load last city or location
window.onload = () => {
  const savedCity = localStorage.getItem("city");

  if (savedCity) {
    fetchWeather(`q=${savedCity}`);
  } else {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
    });
  }
};

// 🔍 Search
function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return;

  localStorage.setItem("city", city);
  fetchWeather(`q=${city}`);
}

// 🎤 Voice Search
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onresult = function(event) {
    const city = event.results[0][0].transcript;
    document.getElementById("cityInput").value = city;
    getWeather();
  };

  recognition.start();
}

// 🌦 Fetch current weather
async function fetchWeather(query) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`
  );
  const data = await res.json();

  if (data.cod !== 200) return;

  document.getElementById("weatherResult").innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].main}</p>
    <h1>${data.main.temp}°C</h1>
  `;

  fetchForecast(data.coord.lat, data.coord.lon);
}

// 📅 5-day forecast
async function fetchForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  const data = await res.json();
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach(day => {
    forecastDiv.innerHTML += `
      <div class="forecast-item">
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}