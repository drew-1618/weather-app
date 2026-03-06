const strBaseApiUrl = 'https://api.open-meteo.com/v1/forecast'
const strParams = '?latitude=36.17&longitude=-85.5&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code,daylight_duration,sunshine_duration,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,apparent_temperature,weather_code,is_day,precipitation_probability,precipitation,visibility,wind_speed_10m,uv_index&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_direction_10m,wind_speed_10m&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch'


function getWeatherIcon(weatherCode, isDay) {
    // clear
    if (weatherCode === 0) {
        return isDay ? "bi-brightness-high-fill" : "bi-moon-stars-fill"
    }
    
    // overcast
    if (weatherCode >= 1 && weatherCode <= 3) {
        if (weatherCode === 3) {
            return "bi-cloudy-fill"
        }
        return isDay ? "bi-cloud-sun-fill" : "bi-cloud-moon-fill"
    }

    // fog
    if (weatherCode === 45 || weatherCode === 48) {
        return "bi-cloud-fog-fill"
    }

    // drizzle and rain
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
        return "bi-cloud-rain-heavy-fill"
    }

    // snow
    if (weatherCode >= 71 && weatherCode <= 77) {
        return "bi-snow"
    }

    // storm
    if (weatherCode >= 95) {
        return "bi-cloud-lightning-rain-fill"
    }
}



// get data
async function getWeatherData() {
    try {
        const response = await fetch(strBaseApiUrl+strParams)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const result = await response.json()
        // for reference
        console.log(result)
        const current = result.current

        // update current temp
        document.getElementById('txtCurrentTemp').innerText = `${Math.round(current.temperature_2m)} °F`
        // update current humidity
        document.getElementById('txtCurrentHumidity').innerText = `Humidity: ${current.relative_humidity_2m}%`

        // update weather icon
        const strIconClass = getWeatherIcon(current.weather_code, current.is_day)
        document.getElementById('txtWeatherIcon').className = "bi " + strIconClass

    }
    catch (error) {
        console.error("Error fetching weather: ", error)
    }
}

getWeatherData()
