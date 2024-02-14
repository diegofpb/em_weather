let API_KEY = null
let API_ID_MUNICIPIO = null;
let API_URL = "";
let dayNumber = 0;
const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const today = new Date().getDay();
const nextDays = [today, (today + 1) % 7, (today + 2) % 7];
const nextThreeDaysAbbreviated = nextDays.map((dayIndex) => daysOfWeek[dayIndex]);

const token = getQueryParamValue(window.location.search, 'token');
const municipioId = getQueryParamValue(window.location.search, 'municipioId');

if (token && municipioId) {
    API_KEY = token;
    API_ID_MUNICIPIO = municipioId;
    getWeatherForecast();
} else {
    console.log('The token or municipioId variable not found in the url query params.');
}

function getQueryParamValue(url, param) {

    const queryString = url.split('?')[1];
    if (!queryString) {
        return null;
    }
    const pairs = queryString.split('&');
    for (let i = 0; i < pairs.length; i++) {
        const [key, value] = pairs[i].split('=');
        if (decodeURIComponent(key) === param) {
            return decodeURIComponent(value || '');
        }
    }
    return null;
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
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.estado === 200) {
                    var API_URL = data.datos;
                    var xhr2 = new XMLHttpRequest();
                    xhr2.onreadystatechange = function() {
                        if (xhr2.readyState === XMLHttpRequest.DONE) {
                            if (xhr2.status === 200) {
                                var data = JSON.parse(xhr2.responseText);
                                var hour = new Date().getHours();
                                var temp = 0;
                                data[0].prediccion.dia[0].temperatura.every(function(entry) {
                                    if (hour <= parseInt(entry.periodo)) {
                                        temp = entry.value;
                                        return false;
                                    }
                                    return true;
                                });
                                var cityNameElement = document.getElementById("cityName");
                                cityNameElement.textContent = temp + "º";
                            } else {
                                console.log("Error al realizar la segunda solicitud:", xhr2.statusText);
                                var cityNameElement = document.getElementById("cityName");
                                cityNameElement.textContent = "N/A";
                            }
                        }
                    };
                    xhr2.open("GET", API_URL, true);
                    xhr2.send();
                } else {
                    console.log("Estado de la primera solicitud no válido:", data.estado);
                }
            } else {
                console.log("Error al realizar la primera solicitud:", xhr.statusText);
            }
        }
    };
    
    xhr.open("GET", "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/" + API_ID_MUNICIPIO + "/?api_key=" + API_KEY, true);
    xhr.send();
    

}

function getWeatherForecast(){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.estado === 200) {
                    var API_URL = data.datos;
                    var xhr2 = new XMLHttpRequest();
                    xhr2.onreadystatechange = function() {
                        if (xhr2.readyState === XMLHttpRequest.DONE) {
                            if (xhr2.status === 200) {
                                var jsonData = JSON.parse(xhr2.responseText);
                                var weatherContainer = document.getElementById("weatherContainer");
                                if (jsonData[0].nombre) {
                                    var cityElement = document.createElement("div");
                                    cityElement.id = "cityId";
                                    cityElement.className = "city";
                                    cityElement.innerHTML = getFirstPartOfCityName(jsonData[0].nombre);
                                    var cityNameElement = document.createElement("span");
                                    cityNameElement.id = "cityName";
                                    cityNameElement.textContent = "...";
                                    cityElement.appendChild(cityNameElement);
                                    weatherContainer.appendChild(cityElement);
                                }
                                var dataSliced = jsonData[0].prediccion.dia.slice(0, 3);
                                dataSliced.forEach(function(entry) {
                                    var weatherCard = document.createElement("div");
                                    weatherCard.className = "weather-card";
                                    var dayElement = document.createElement("div");
                                    dayElement.className = "day";
                                    dayElement.textContent = dayNumber === 0 ? "Hoy" : nextThreeDaysAbbreviated[dayNumber];
                                    weatherCard.appendChild(dayElement);
                                    var conditionIcon = document.createElement("img");
                                    conditionIcon.className = "condition-icon";
                                    conditionIcon.src = "https://www.aemet.es/imagenes/png/estado_cielo/" + getFirstElementNotEmptyOfPrediction(entry.estadoCielo).value + ".png";
                                    weatherCard.appendChild(conditionIcon);
                                    var temperatureContainer = document.createElement("div");
                                    temperatureContainer.className = "temperature";
                                    var temperatureElement = document.createElement("div");
                                    temperatureElement.className = "temp-max";
                                    temperatureElement.textContent = entry.temperatura.maxima + "º";
                                    temperatureContainer.appendChild(temperatureElement);
                                    var temperatureSecondaryElement = document.createElement("div");
                                    temperatureSecondaryElement.className = "temp-min";
                                    temperatureSecondaryElement.textContent = entry.temperatura.minima + "º";
                                    temperatureContainer.appendChild(temperatureSecondaryElement);
                                    weatherCard.appendChild(temperatureContainer);
                                    weatherContainer.appendChild(weatherCard);
                                    dayNumber++;
                                });
                                getWeatherCurrentConditions();
                            } else {
                                console.log("Error al realizar la segunda solicitud:", xhr2.statusText);
                                var weatherContainer = document.getElementById("weatherContainer");
                                var cityElement = document.createElement("div");
                                cityElement.id = "cityId";
                                cityElement.className = "city";
                                cityElement.textContent = "Tiempo no disponible.";
                                weatherContainer.appendChild(cityElement);
                            }
                        }
                    };
                    xhr2.open("GET", API_URL, true);
                    xhr2.send();
                } else {
                    console.log("Estado de la primera solicitud no válido:", data.estado);
                }
            } else {
                console.log("Error al realizar la primera solicitud:", xhr.statusText);
            }
        }
    };
    
    xhr.open("GET", "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/" + API_ID_MUNICIPIO + "/?api_key=" + API_KEY, true);
    xhr.send();
    

    

}