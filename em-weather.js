let API_KEY = null
let API_ID_MUNICIPIO = null;
let API_URL = "";
let dayNumber = 0;
const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const today = new Date().getDay();
const nextDays = [today, (today + 1) % 7, (today + 2) % 7];
const nextThreeDaysAbbreviated = nextDays.map((dayIndex) => daysOfWeek[dayIndex]);

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const municipioId = urlParams.get('municipioId');

if (token && municipioId) {
    API_KEY = token;
    API_ID_MUNICIPIO = municipioId;
    getWeatherForecast();
} else {
    console.log('The token or municipioId variable not found in the url query params.');
}

function getFirstPartOfCityName(fullCityName) {
    const cityNameSplitted = fullCityName.split('/');
    return cityNameSplitted.length > 1 ? cityNameSplitted[0] : fullCityName;
}
  
function getFirstElementNotEmptyOfPrediction(skyStatus) {
    const firstElement = skyStatus.find((element) => element.value !== "");
    return firstElement || "";
}

function getWeatherCurrentConditions(){
    fetch(
        "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/" +
            API_ID_MUNICIPIO +
            "/?api_key=" +
            API_KEY
        )
        .then((response) => response.json())
        .then((data) => {
            if (data.estado == 200) {
                API_URL = data.datos;
            }
        })
        .then(() => {
            fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                const hour = new Date().getHours();
                let temp = 0;

                data[0].prediccion.dia[0].temperatura.every((entry) => {
                    if(hour <= parseInt(entry.periodo)){
                        temp = entry.value;
                        return false;
                    }
                    return true;
                });
                const cityNameElement = document.getElementById("cityName");
                cityNameElement.textContent = temp + "º";
            })
            .catch((error) => {
                console.log(error);
                const cityNameElement = document.getElementById("cityName");
                cityNameElement.textContent = "N/A";
            });
        });

}

function getWeatherForecast(){

    fetch(
        "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/" +
            API_ID_MUNICIPIO +
            "/?api_key=" +
            API_KEY
        )
        .then((response) => response.json())
        .then((data) => {
            if (data.estado == 200) {
                API_URL = data.datos;
            }
        })
        .then(() => {
            fetch(API_URL)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const text = new TextDecoder('iso-8859-1').decode(buffer);
                const jsonData = JSON.parse(text);
                return jsonData;
            })
            .then((data) => {
                const weatherContainer = document.getElementById("weatherContainer");
        
                if (data[0].nombre) {
                  
        
                    const cityElement = document.createElement("div");
                    cityElement.id = "cityId";
                    cityElement.className = "city";
                    cityElement.innerHTML = getFirstPartOfCityName(data[0].nombre);
                    const cityNameElement = document.createElement("span");
                    cityNameElement.id = "cityName";
                    cityNameElement.textContent = "...";
                    cityElement.appendChild(cityNameElement);
                    weatherContainer.appendChild(cityElement);
                }
        
        
                const dataSliced = data[0].prediccion.dia.slice(0, 3);
        
                dataSliced.forEach((entry) => {
                const weatherCard = document.createElement("div");
                weatherCard.className = "weather-card";
        
                const dayElement = document.createElement("div");
                dayElement.className = "day";
                dayElement.textContent =
                    dayNumber === 0 ? "Hoy" : nextThreeDaysAbbreviated[dayNumber];
                weatherCard.appendChild(dayElement);
        
                const conditionIcon = document.createElement("img");
                conditionIcon.className = "condition-icon";
                conditionIcon.src =
                    "https://www.aemet.es/imagenes/png/estado_cielo/" +
                    getFirstElementNotEmptyOfPrediction(entry.estadoCielo).value +
                    ".png";
                weatherCard.appendChild(conditionIcon);
        
                const temperatureContainer = document.createElement("div");
                temperatureContainer.className = "temperature";
        
                const temperatureElement = document.createElement("div");
                temperatureElement.className = "temp-max";
                temperatureElement.textContent = entry.temperatura.maxima + "º";
                temperatureContainer.appendChild(temperatureElement);
        
                const temperatureSecondaryElement =
                    document.createElement("div");
                temperatureSecondaryElement.className = "temp-min";
                temperatureSecondaryElement.textContent =
                    entry.temperatura.minima + "º";
                temperatureContainer.appendChild(temperatureSecondaryElement);
        
                weatherCard.appendChild(temperatureContainer);
        
                weatherContainer.appendChild(weatherCard);
                dayNumber++;
                });
                getWeatherCurrentConditions();
            })
            .catch((error) => {
                console.log(error);
                const weatherContainer =
                document.getElementById("weatherContainer");
                const cityElement = document.createElement("div");
                cityElement.id = "cityId";
                cityElement.className = "city";
                cityElement.textContent = "Tiempo no disponible.";
                weatherContainer.appendChild(cityElement);
            });
        });

}