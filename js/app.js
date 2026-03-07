const strBaseApiUrl = 'https://api.open-meteo.com/v1/forecast'
const strParams = '?latitude=36.17&longitude=-85.5&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code,daylight_duration,sunshine_duration,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,apparent_temperature,weather_code,is_day,precipitation_probability,precipitation,visibility,wind_speed_10m,uv_index&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_direction_10m,wind_speed_10m&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch'

// get data
async function getWeatherData() {
    try {
        const response = await fetch(strBaseApiUrl+strParams)
        const data = await response.json()
        console.log(data)
        // to view when the data being displayed was last fetched
        const now = new Date()
        const strTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        // updates
        updateCurrentWeather(data.current)
        updateForecast(data.daily)
        document.getElementById('txtLastUpdated').innerHTML = `<i class="bi bi-clock-fill text-primary"></i> Last updated: ${strTime}`
    } catch (error) {
        console.error("Error fetching weather: ", error)
        
    }
}

function updateCurrentWeather(current) {
    // update current temp
    document.getElementById('txtCurrentTemp').innerHTML = `<i class="bi bi-thermometer-half text-warning"></i> ${Math.round(current.temperature_2m)} °F`
    // update current humidity
    document.getElementById('txtCurrentHumidity').innerHTML = `<i class="bi bi-droplet-half text-info"></i> Humidity: ${current.relative_humidity_2m}%`
    // update weather icon
    const strIconClass = getWeatherIcon(current.weather_code, current.is_day)
    document.getElementById('txtWeatherIcon').className = "bi " + strIconClass
}

function updateForecast(daily) {
    const forecastRow = document.getElementById('forecastRow')
    forecastRow.innerHTML = ''

    daily.time.forEach((strDate, i) => {
        const strIconClass = getWeatherIcon(daily.weather_code[i], 1)   // since dealing with whole days, assume is_day = 1
        // show "today" or day of the week in forecast
        const strDayName = i === 0 ? "Today" : new Date(strDate + 'T00:00').toLocaleDateString('en-US', {weekday: 'short'})
        forecastRow.innerHTML += `
            <div class="col-12 mb-2">
                <div class="card shadow-sm border-0">
                    <div class="card-body d-flex align-items-center justify-content-between py-2">
                        <div style="width: 100px;" class="fw-bold text-start">${strDayName}</div>
                        <div class="fs-4 text-secondary">
                            <i class="bi ${strIconClass}"></i>
                        </div>
                        <div class="text-end">
                            <span><span class="opacity-75">L: ${Math.round(daily.temperature_2m_min[i])}°</span> <strong>H: ${Math.round(daily.temperature_2m_max[i])}°</strong></span>

                        </div>
                    </div>
                </div>
            </div>
        `
    })
}

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

getWeatherData()

document.querySelector('#btnRefresh').addEventListener('click', () => {
    getWeatherData()
})

/*
AI Usage:
    - Logic to convert time to day of the week name in updateForecast()
    - 
*/