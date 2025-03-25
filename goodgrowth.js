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

// grab the js path of target container where we want to inject weather data from dev tools
const target = document.querySelector(
  "#content > section.Sectionstyle__StyledSection-sc-1rnt8u1-0.eigAqT.Placestyle__HeroSection-sc-7yy3d-0.kfKURt > div > div > div > div"
);
// create a new div element to contain the weather data
const weatherContainer = document.createElement("div");
// give it a unique ID
weatherContainer.id = "weather-widget";
// add some basic styling
weatherContainer.style.marginTop = "10px";
weatherContainer.style.padding = "10px";
weatherContainer.style.border = "1px solid #ccc";
weatherContainer.style.background = "#f5f5f5";
weatherContainer.style.fontSize = "1rem";

// get the temperature to 1 decimal place
const temp = weatherData.list[0].main.temp.toFixed(1);
// inject the temp into newly created weatherContainer
weatherContainer.innerText = `Current temperature: ${temp}°C`;

// append the weatherContainer to the target element
if (target) {
  target.appendChild(weatherContainer);
} else {
  console.error("Target element not found");
}
