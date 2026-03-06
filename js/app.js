const strBaseApiUrl = 'https://api.open-meteo.com/v1/forecast'
const strParams = '?latitude=36.17&longitude=-85.5&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code,daylight_duration,sunshine_duration,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,apparent_temperature,weather_code,is_day,precipitation_probability,precipitation,visibility,wind_speed_10m,uv_index&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_direction_10m,wind_speed_10m&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch'


function getWeatherIcon(weatherCode, isDay) {
    if (weatherCode === 0 && isDay === 1) {
        return "bi-brightness-high-fill"
    }
    else if (weatherCode === 0 && isDay === 0) {
        return "bi-moon-stars-fill"
    }
    return "bi-cloud"   // default
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

        const currentTemp = result.current.temperature_2m
        const currentHumidity = result.current.relative_humidity_2m
        const weatherCode = result.current.weather_code
        const isDay = result.current.is_day

        // update weather icon
        const txtIconClass = getWeatherIcon(weatherCode, isDay)
        document.getElementById('txtWeatherIcon').className = "bi " + txtIconClass

    }
    catch (error) {
        console.error(error.message)
    }
}

getWeatherData()




document.querySelector('#btnTest').addEventListener('click', () => {
    fetch(strBaseApiUrl + strParams)
    .then(result => {
        if (result.ok) {
            return result.json()
        }
        else {
            throw new Error(result.status)
        }
    })
    .then(data => {
        console.log("Full Data: ", data)
        const floatCurrentTemp = data.current.temperature_2m
        console.log("Current temperature is: " + floatCurrentTemp)

        document.getElementById("txtTest").innerHTML = "Current Temp: " + floatCurrentTemp
    })
})