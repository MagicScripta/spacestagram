const BASE_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers";
const CURIOSITY_URL = BASE_URL + "/curiosity/photos?sol=";
const OPPORTUNITY_URL = BASE_URL + "/opportunity/photos?sol=";
const SPIRIT_URL = BASE_URL + "/spirit/photos?sol=";
const API_KEY = "V8QIc6ZU8omN2oDEQU3f3pd6OtBiDwvUc2Z98Aff";

export async function getRoverImages(sol, rover) {
  switch (rover) {
    case "opportunity":
      base = OPPORTUNITY_URL;
      break;
    case "spirit":
      base = SPIRIT_URL;
      break;
    case "curiosity":
    default:
      let base = CURIOSITY_URL;
  }

  let requestUrl = base + sol + "&api_key=" + API_KEY;
  return await fetch(requestUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return sortRoverUrls(data.photos);
    })
    .catch((err) => {
      console.warn("Couldn't fetch the photos", err);
    });
}

// Process the data from the API
async function sortRoverUrls(data) {
  const sortedUrls = {}
  data.map((photo) => {
    let cameraName = photo.camera.name;
    (cameraName in sortedUrls) ? sortedUrls[cameraName].push(photo) : sortedUrls[cameraName] = [photo]})
  return sortedUrls
}
