const BASE_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers";
const CURIOSITY_URL = BASE_URL + "/curiosity/photos?sol=";
const OPPORTUNITY_URL = BASE_URL + "/opportunity/photos?sol=";
const SPIRIT_URL = BASE_URL + "/spirit/photos?sol=";
const API_KEY = "V8QIc6ZU8omN2oDEQU3f3pd6OtBiDwvUc2Z98Aff";

export async function getRoverImages(sol, rover) {
  let base = CURIOSITY_URL;
  switch (rover) {
    case "opportunity":
      base = OPPORTUNITY_URL;
      break;
    case "spirit":
      base = SPIRIT_URL;
      break;
    case "curiosity":
    default:
      base = CURIOSITY_URL;
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

async function getRoverManifest(rover) {
  return await fetch(
    `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${API_KEY}`
  ).then((r) => {
    return r.json();
  });
}

function intersectAbsentees(rovers) {
  const absentees = [];
  let maxSol = Math.max(
    rovers[0].photo_manifest.max_sol,
    rovers[1].photo_manifest.max_sol,
    rovers[2].photo_manifest.max_sol
  );

  rovers.forEach((photos) => {
    let notAvailable = [...Array(maxSol).keys()];
    photos.photo_manifest.photos.map((photo) => {
      notAvailable =
        photo.sol in notAvailable
          ? arrayRemove(notAvailable, photo.sol)
          : notAvailable;
    });
    absentees.push([photos.photo_manifest.max_sol, notAvailable]);
  });
  absentees.push(maxSol);
  return absentees;
}

export async function getManifests() {
  const cur = await getRoverManifest("curiosity");
  const opp = await getRoverManifest("opportunity");
  const spr = await getRoverManifest("spirit");
  const fullAbs = intersectAbsentees([cur, opp, spr]);
  const allAbs = getArraysIntersection(
    getArraysIntersection(fullAbs[0][1], fullAbs[1][1]),
    fullAbs[2][1]
  );
  return {
    cur: fullAbs[0],
    opp: fullAbs[1],
    spr: fullAbs[2],
    fullAbs: allAbs,
    maxSol: fullAbs[3],
  };
}

// Process the data from the API
async function sortRoverUrls(data) {
  const sortedUrls = {};
  data.map((photo) => {
    let cameraName = photo.camera.name;
    cameraName in sortedUrls
      ? sortedUrls[cameraName].push(photo)
      : (sortedUrls[cameraName] = [photo]);
  });
  return sortedUrls;
}

export function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele !== value;
  });
}

function getArraysIntersection(a1, a2) {
  return a1.filter(function (n) {
    return a2.indexOf(n) !== -1;
  });
}
