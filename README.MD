# Weather Forecast Web App

## Overview

This project is a web application that displays the current weather and forecasts for the next two days. The design is optimized for small screens, adhering to the [Digital Audio Broadcasting (DAB) standard](https://www.etsi.org/deliver/etsi_ts/101400_101499/101499/02.02.01_60/ts_101499v020201p.pdf).

## Features

- **Current Weather:** View the current weather conditions.
- **Two-Day Forecast:** Get forecasts for the next two days.
- **Responsive Design:** Adapted to smaller screens, following the DAB standard.

## How to Use

### Requirements

1. **AEMET API Token:** You need to obtain an API token from the [AEMET OpenData platform](https://opendata.aemet.es/).
2. **Municipality Code:** Obtain the municipality code for the location you want to get weather information for from [SEPE](https://www.sepe.es/HomeSepe/empresas/servicios-para-empresas/comunica-contratacion/obtencion-codigos/busqueda-municipios.html).

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/diegofpb/em_weather.git
   ```

2. Navigate to the project directory:

   ```bash
   cd em-weather
   ```

3. Open `em-weather.html` in your web browser, and add the following query params:

    - token: Your AEMET API Token
    - municipioId: The Municipality Code.
    
    For example, with token XXXX and the municipality code of Madrid (28079):
    ```url
    http://127.0.0.1:3000/em-weather.html?municipioId=28079&token=XXXX
    ```

    You will get the following rendered HTML:

    ![Preview rendered HTML of Madrid](https://github.com/diegofpb/em_weather/blob/main/28079.png?raw=true)

   > Note that the HTML file will be rendered instantly, but not the weather data, since these have to be obtained from calls to the AEMET API, and it can take up to 10 seconds to answer the request in certain cases. If it is intended to obtain an image of such information, it is recommended to give a delay of approximately 10 seconds.


## Technologies Used

- HTML5
- CSS3
- JavaScript (Fetch API for API requests)

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Weather data provided by [AEMET OpenData](https://opendata.aemet.es/).
