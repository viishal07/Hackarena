const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set up your OpenWeatherMap API Key
const API_KEY = 'cdc69ab4dd63d2de2353679abfb07ecf';  // Replace with your actual key


app.use(express.static('public'));

// Endpoint to get weather data from OpenWeatherMap
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const weatherData = weatherResponse.data;
        const description = weatherData.weather[0].description;

        // Get agricultural recommendations based on weather description
        const agriculturalData = getAgriculturalRecommendations(description);

        // Combine weather and agricultural data
        const combinedData = {
            weather: weatherData,
            agriculture: agriculturalData
        };

        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});


function getAgriculturalRecommendations(description) {
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


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});