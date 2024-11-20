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
            setTimeout(() => {
             document.getElementById('city').style.display = 'none'; 
             document.getElementById('getWeatherbutton').style.display = 'none'; },
            0);
           
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
    

    if (data.code === '404') {
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
    }
}

function displayAgriculturalRecommendations(data) {
    const recommendationsDiv = document.getElementById('agricultural-recommendations');
    recommendationsDiv.innerHTML = `
        
        <div id="water-level">
            <h4>Water Level:</h4>
            <p>${data.waterLevel}</p>
        </div>
        <div id="pesticides">
            <h4>Pesticides:</h4>
            <p>${data.pesticides}</p>
        </div>
        <div id="fertilizers">
            <h4>Fertilizers:</h4>
            <p>${data.fertilizers}</p
        </div>
    `;
}

function showImage() {
    const weatherIcon = document.querySelector('img');
    weatherIcon.style.display = 'block';
}     