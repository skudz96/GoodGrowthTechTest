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
  const url =
    "https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=27.987850&lon=86.925026";
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
const weatherData = await getData();
// testing we can still access data as we need
console.log(weatherData.list[0].main.temp);
