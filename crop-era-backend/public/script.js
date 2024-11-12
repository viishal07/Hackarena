

function getweather() {
    const city = document.getElementById('city').value; // Get the city from the input field
    if (!city) {
        alert('Please enter a city');
        return;
    }

    // Fetch weather and agricultural data from the backend API
    fetch(`/api/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            // Display weather data
            displayWeather(data.weather);

            // Display agricultural recommendations
            displayAgriculturalRecommendations(data.agriculture);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error, please try again');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.querySelector('img');

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();

        // Fetch agricultural recommendations based on weather description
        const agriculturalData = getAgriculturalRecommendations(description);
        displayAgriculturalRecommendations(agriculturalData);
    }
}

function getAgriculturalRecommendations(description) {
    // Define weather condition to agricultural recommendation mapping
    const recommendations = {
        "light rain": {
            waterLevel: "Keep water around 2-3 cm; rain can be sufficient but may need supplemental irrigation if needed.",
            pesticides: "Light rain can increase humidity, which is favorable for fungal growth. Apply fungicides if fungal disease risk increases.",
            fertilizers: "Reduce nitrogen fertilizers, as they can leach with rain. Use slow-release or organic fertilizers instead."
        },
        "moderate rain": {
            waterLevel: "Maintain around 3-4 cm. Ensure proper drainage to avoid waterlogging.",
            pesticides: "Consider pesticides with rain-resistant properties if pest pressure is high.",
            fertilizers: "Delay application if rain is persistent to avoid leaching. Resume when rain subsides."
        },
        "snow": {
            waterLevel: "Not applicable as fields may freeze. Ensure any irrigation systems are drained to avoid damage.",
            pesticides: "Avoid applications until the temperature rises, as they may not be effective.",
            fertilizers: "Wait until snow melts and temperatures rise to prevent waste and frost damage."
        },
        "clear sky": {
            waterLevel: "Maintain steady at 4-5 cm for young plants, adjusting slightly for growth stages.",
            pesticides: "Regular monitoring; apply pesticides if pest populations rise.",
            fertilizers: "Apply nitrogen fertilizers to support healthy growth. Use phosphorus and potassium to support root and grain development."
        },
        "overcast clouds": {
            waterLevel: "Monitor, but no major adjustments. Consider 3-4 cm for young plants.",
            pesticides: "Fungal diseases may be more likely in humid conditions; consider preventive fungicides.",
            fertilizers: "Apply nitrogen carefully, as growth may be slower. Adjust based on the crop's health."
        },
        "few clouds": {
            waterLevel: "Maintain at a steady level around 3-4 cm.",
            pesticides: "Continue regular pest control if needed.",
            fertilizers: "Regular application as needed, with a focus on nitrogen fertilizers to support growth."
        },
        "thunderstorm": {
            waterLevel: "Check drainage, as waterlogging can harm rice plants. Ensure a stable 2-3 cm after storm subsides.",
            pesticides: "Apply only if necessary; wait until after the storm.",
            fertilizers: "Avoid during stormy conditions; resume applications after storm subsides to avoid runoff."
        },
        "drizzle": {
            waterLevel: "Minimal adjustment; maintain at a stable level.",
            pesticides: "Humidity can increase pest risk; apply protective fungicides if necessary.",
            fertilizers: "Small doses as needed; avoid excessive nitrogen as it may leach."
        },
        "mist": {
            waterLevel: "No major changes required. Maintain 2-4 cm.",
            pesticides: "Consider fungicides to protect against mold and mildew.",
            fertilizers: "Regular application as needed; nitrogen, potassium, and phosphorus are safe to use in regular doses."
        },
        
    };

   
    const weatherKey = description.toLowerCase();
    return recommendations[weatherKey] || {
        waterLevel: "Conditions are normal, no specific adjustments needed.",
        pesticides: "Monitor pest levels and apply treatments as needed.",
        fertilizers: "Apply fertilizers based on crop needs."
    };
}

function displayAgriculturalRecommendations(data) {
    const recommendationsDiv = document.getElementById('agricultural-recommendations');
    recommendationsDiv.innerHTML = `
        <h3>Agricultural Recommendations:</h3>
        <p><strong>Water Level:</strong> ${data.waterLevel}</p>
        <p><strong>Pesticides:</strong> ${data.pesticides}</p>
        <p><strong>Fertilizers:</strong> ${data.fertilizers}</p>
    `;
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert from Kelvin to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.querySelector('img');
    weatherIcon.style.display = 'block';
}
