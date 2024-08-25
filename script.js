document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city");
    const cityList = document.getElementById("city-list");
    const weatherForm = document.getElementById("weather-form");
    const weatherInfo = document.getElementById("weather-info");

    const OPENWEATHER_API_KEY = "c0c60635aa1561be85b3c35c93a9e69c"; // Your OpenWeatherMap API key
    const GEO_NAMES_USERNAME = "jeda"; // Your GeoNames username
    

    // Event listener for city input to fetch suggestions
    cityInput.addEventListener("input", async function () {
        const query = cityInput.value.trim();
        if (query.length > 2) {
            await fetchCitySuggestions(query);
        }
    });

    // Function to fetch city suggestions from GeoNames API
    async function fetchCitySuggestions(query) {
        const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=5&username=${GEO_NAMES_USERNAME}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch city suggestions");
            }
            const data = await response.json();
            displayCitySuggestions(data.geonames);
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    }

    // Function to display city suggestions in the datalist
    function displayCitySuggestions(cities) {
        cityList.innerHTML = ""; // Clear previous suggestions
        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city.name; // Assuming 'name' is the city name
            cityList.appendChild(option);
        });
    }

    // Event listener for form submission to fetch weather data
    weatherForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
        const cityName = cityInput.value.trim();
        if (cityName) {
            await fetchWeatherData(cityName);
        }
    });

    // Function to fetch weather data from OpenWeatherMap API
    async function fetchWeatherData(cityName) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            const data = await response.json();
            displayWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            weatherInfo.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
        }
    }

    // Function to display weather data
    function displayWeatherData(data) {
        if (data.cod !== 200) {
            weatherInfo.innerHTML = `<p>${data.message}</p>`;
            return;
        }
        weatherInfo.innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Condition:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        `;
    }
});
