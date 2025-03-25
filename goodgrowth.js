// accessing the DOM with the path of the anchor tag containing destination coordinates
const href = document.querySelector("#propertyViewOnGoogleMaps_image").href;
// create a URL object from the string
const url = new URL(href);
// extract the query parameters
const destination = url.searchParams.get("destination");
// split the coordinates, returning an array of strings
const [latString, lonString] = destination.split(",");
// convert the strings to numbers
const lat = parseFloat(latString);
const lon = parseFloat(lonString);
// ensure they're definitely numbers (works so commentnig out)
/* console.log(typeof lat);
console.log(typeof lon); */

// function to get data from the API
async function getData() {
  const url = `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    // removed console log, return the data as is
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

// and store it in a constant. Extract what we need from it whereever we want to render info
// only making one call to the API, any subsequent uses of accessing weatherData will use the same data rather than making new requests
const weatherData = await getData();
// testing we can still access data as we need
console.log(weatherData.list[0].main.temp + "working temp");

// function to format the time
function formatTime(datetimeStr) {
  const date = new Date(datetimeStr);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// title container
const title = document.createElement("h2");
title.textContent = "Weather Forecast for the next 12 hours:";
title.style.fontSize = "1.5rem";
title.style.marginBottom = "0.5rem";
title.style.fontWeight = "600";

// function to create a weather card with all our desired information and light styling
function createWeatherCard(entry) {
  // create a new div element to contain the weather data
  const card = document.createElement("div");
  // give it a unique ID
  card.id = "weather-card";
  // and some light styling
  card.style.padding = "8px";
  card.style.margin = "5px";
  card.style.border = "1px solid #ccc";
  card.style.borderRadius = "8px";
  card.style.display = "inline-block";
  card.style.textAlign = "center";
  card.style.width = "100px";
  card.style.backgroundColor = "#fff";

  // time container
  const time = document.createElement("div");
  time.textContent = formatTime(entry.dt_txt);

  // icon container
  const icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;
  icon.style.width = "50px";

  // temp container to 1 decimal place
  const temp = document.createElement("div");
  temp.innerText = entry.main.temp.toFixed(1) + "°C";

  // weather conditions container
  const desc = document.createElement("div");
  desc.style.fontSize = "0.8rem";
  desc.style.color = "#555";
  desc.textContent = entry.weather[0].main;

  // append all the elements to the card
  card.appendChild(time);
  card.appendChild(icon);
  card.appendChild(temp);
  card.appendChild(desc);

  return card;
}

// create a container to hold all the weather cards
const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.flexWrap = "wrap";
wrapper.style.gap = "10px";
wrapper.style.marginTop = "15px";
wrapper.style.backgroundColor = "#f0f0f0";
wrapper.style.padding = "10px";
wrapper.style.borderRadius = "10px";

// loop through the weather data and create a card for today's forecast
for (let i = 0; i < 4; i++) {
  const entry = weatherData.list[i];
  // append the card to the wrapper. Looping through the first 4 entries to display the next 12 hours
  wrapper.appendChild(createWeatherCard(entry));
}

// grab the js path of target container where we want to inject weather data from dev tools
const target = document.querySelector(
  "#content > section.Sectionstyle__StyledSection-sc-1rnt8u1-0.eigAqT.Placestyle__HeroSection-sc-7yy3d-0.kfKURt > div > div > div > div"
);

// append the wrapper to the target element
if (target) {
  target.appendChild(wrapper);
} else {
  console.error("Target element not found");
}

// append the title to the target element
wrapper.parentNode.insertBefore(title, wrapper);
