const BASE_URL =
  "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=";
const API_KEY = "V8QIc6ZU8omN2oDEQU3f3pd6OtBiDwvUc2Z98Aff";
let extension = "";

export async function getRoverImages(sol, params) {
  Object.keys(params).forEach((key) => {
    extension += "&" + key + "=" + params[key];
  });

  let requestUrl = BASE_URL + sol + extension + "&api_key=" + API_KEY;
  return await fetch(requestUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.warn("Couldn't fetch the photos", err);
    });
}

// Process the data from the API
async function getRoverUrls(data) {}
