const cityCoordinates = {
    "Tunis": { lat: 36.8065, lon: 10.1815 },
    "Sfax": { lat: 34.7406, lon: 10.7603 },
    "Sousse": { lat: 35.8256, lon: 10.6369 },
    "Kairouan": { lat: 35.6781, lon: 10.0963 },
    "Bizerte": { lat: 37.2744, lon: 9.8739 },
    "Gabès": { lat: 33.8815, lon: 10.0982 },
    "Ariana": { lat: 36.8625, lon: 10.1956 },
    "Gafsa": { lat: 34.4250, lon: 8.7842 },
    "La Marsa": { lat: 36.8782, lon: 10.3247 },
    "Monastir": { lat: 35.7780, lon: 10.8262 },
    "Ben Arous": { lat: 36.7531, lon: 10.2189 },
    "Tataouine": { lat: 32.9297, lon: 10.4518 },
    "Médenine": { lat: 33.3549, lon: 10.5055 },
    "Nabeul": { lat: 36.4561, lon: 10.7376 },
    "Zaghouan": { lat: 36.4029, lon: 10.1429 },
    "Kasserine": { lat: 35.1676, lon: 8.8365 },
    "Sidi Bouzid": { lat: 35.0382, lon: 9.4849 },
    "Jendouba": { lat: 36.5011, lon: 8.7802 },
    "Le Kef": { lat: 36.1742, lon: 8.7049 },
    "Siliana": { lat: 36.0843, lon: 9.3708 },
    "Tozeur": { lat: 33.9197, lon: 8.1335 },
    "Kebili": { lat: 33.7044, lon: 8.9690 },
    "Mahdia": { lat: 35.5047, lon: 11.0622 },
    "Beja": { lat: 36.7256, lon: 9.1817 },
    "Manouba": { lat: 36.8080, lon: 10.0972 }
};

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
}

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    try {
        const coords = cityCoordinates[city];
        if (!coords) {
            displayError('City not found. Please select a city from the list.');
            return;
        }

        // Fetch weather data using open-meteo (free API, no key required)
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=auto`);
        const data = await response.json();

        if (!data.current_weather) {
            displayError('Weather data unavailable.');
            return;
        }

        displayWeather(data, city);
    } catch (error) {
        displayError('Error fetching weather data.');
    }
}

function displayWeather(data, city) {
    const current = data.current_weather;
    const humidity = data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] : 'N/A';
    const description = getWeatherDescription(current.weathercode);
    const display = document.getElementById('weather-display');
    display.innerHTML = `
        <div class="weather-card">
            <div class="city-name">${city}, Tunisia</div>
            <div class="temperature">${current.temperature}°C</div>
            <div class="description">${description}</div>
            <div class="details">
                <div class="detail">
                    <strong>Humidity</strong><br>${humidity}%
                </div>
                <div class="detail">
                    <strong>Wind Speed</strong><br>${current.windspeed} km/h
                </div>
                <div class="detail">
                    <strong>Weather</strong><br>${description}
                </div>
            </div>
        </div>
    `;
}

function displayError(message) {
    const display = document.getElementById('weather-display');
    display.innerHTML = `<div class="error">${message}</div>`;
}