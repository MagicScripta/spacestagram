// ** //
import { InputNumber } from "antd";
import { useEffect, useState } from "react";
import { arrayRemove, getManifests, getRoverImages } from "../apis/mars-rover";
import ImageCard from "./ImageCard";
import { useRouter } from "next/router";

const RoverPage = ({ name }) => {
  // ** //
  const router = useRouter();
  const [maxSol, setMaxSol] = useState(1);
  const [roverPosts, setRoverPosts] = useState({});
  const [cameras, setCameras] = useState([]);
  const [currentCamera, setCurrentCamera] = useState("");
  const [posts, setPosts] = useState([]);
  const [solDate, setSolDate] = useState();

  useEffect(() => {
    getManifests().then((rovs) => {
      localStorage.setItem("maxSol", rovs.maxSol);
      localStorage.setItem("curiosityAbs", JSON.stringify(rovs.cur[1]));
      localStorage.setItem("opportunityAbs", JSON.stringify(rovs.opp[1]));
      localStorage.setItem("spiritAbs", JSON.stringify(rovs.spr[1]));
      localStorage.setItem("allAbs", JSON.stringify(rovs.fullAbs));
      console.log(rovs.fullAbs);
    });
  });

  useEffect(() => {
    if (!localStorage.getItem("maxSol")) return;
    setMaxSol(localStorage.getItem("maxSol"));
  });

  useEffect(() => {
    async function fetchRoverData() {
      if (!router.isReady) return;
      const sol = router.query.sol;
      setSolDate(sol);
      await getRoverImages(sol, name).then((response) => {
        let cameraNames = Object.keys(response);
        const camPosts = {};
        const cams = [];
        cameraNames.map((camera) => {
          cams.push(camera);
          const pictures = [];
          response[camera].map((photo) => {
            let likeState = localStorage.getItem("like-" + photo.id);
            likeState = likeState ? likeState : "false";
            pictures.push(
              <ImageCard
                name={name}
                image={photo}
                likeState={likeState}
                key={photo.id}
              />
            );
          });
          camPosts[camera] = pictures;
        });
        setRoverPosts(camPosts);
        setCameras(cams);
        setCurrentCamera(cams[0]);
        setPosts(camPosts[cams[0]].slice(0, 10));
      });
    }

    fetchRoverData().then((resp) => {
      const cover = document.getElementById("cover");
      cover ? (cover.style.display = "block") : {};
      document.getElementById(name).setAttribute("disabled", "");
    });
  }, [router.isReady, name]);

  // Make the first camera selected
  useEffect(() => {
    cameras.length > 0
      ? document.getElementById(currentCamera).setAttribute("disabled", "")
      : {};
  }, [currentCamera]);

  useEffect(() => {
    const page = document.getElementById("main");
    window.onscroll = (scroll) => {
      const maximus =
        document.documentElement.scrollHeight - window.screen.height;
      if (maximus - scroll.path[1].window.pageYOffset < 0.3 * maximus) {
        setPosts(roverPosts[currentCamera].slice(0, posts.length + 5));
      }
    };
  }, [posts]);

  const changeCamera = (clickedCamera) => {
    const cameraId = clickedCamera.target.id;
    setPosts(roverPosts[cameraId].slice(0, 10));
    const buttons = document.querySelectorAll(".camera");
    buttons.forEach((camera) => {
      if (cameraId === camera.id) {
        setCurrentCamera(cameraId);
      } else {
        camera.removeAttribute("disabled");
      }
    });
  };

  useEffect(() => {
    JSON.parse(localStorage.getItem("curiosityAbs")).indexOf(
      parseInt(solDate)
    ) >= 0
      ? document.getElementById("curiosity").setAttribute("disabled", "")
      : {};
    JSON.parse(localStorage.getItem("opportunityAbs")).indexOf(
      parseInt(solDate)
    ) >= 0
      ? document.getElementById("opportunity").setAttribute("disabled", "")
      : {};
    JSON.parse(localStorage.getItem("spiritAbs")).indexOf(parseInt(solDate)) >=
    0
      ? document.getElementById("spirit").setAttribute("disabled", "")
      : {};
  }, []);

  const changeSol = (sol, names) => {
    const allAbsentees = JSON.parse(localStorage.getItem("allAbs"));
    if (allAbsentees || names.length > 0) {
      const name = names[0];
      if (allAbsentees.indexOf(sol) >= 0) {
        const errText = document.getElementById("errText");
        errText.innerText = "We have no photos for this sol";
        errText.style.display = "block";
      } else {
        const absentees = JSON.parse(localStorage.getItem(name + "Abs"));
        if (absentees.indexOf(sol) >= 0) {
          changeSol(sol, arrayRemove(names, name));
        } else {
          router.push("/" + name + "/" + sol);
        }
      }
    } else {
      getManifests().then(() => {
        const errText = document.getElementById("errText");
        errText.innerText = "Error connecting to the API";
        errText.style.display = "block";
      });
    }
  };

  const changeRover = (name) => {
    router.push("/" + name + "/" + solDate);
  };

  return (
    <div id="cover" style={{ display: "none" }}>
      <div id="main">
        <header>
          <h1>
            Spacestagram
            <br />
            Image-sharing from the final frontier
          </h1>
          <img id="rocket" src="/rocket.gif" />
        </header>
        <p id="errText">ERR</p>
        <InputNumber
          id="solDate"
          style={{ width: "100%" }}
          value={solDate}
          size={"large"}
          min={0}
          max={maxSol}
          onChange={(newSol) => {
            document.getElementById("errText").style.display = "none";
            setSolDate(document.getElementById("solDate").value);
          }}
          onPressEnter={() => {
            changeSol(parseInt(solDate), [
              "curiosity",
              "opportunity",
              "spirit",
            ]);
          }}
          defaultValue={1}
          addonBefore="Sol Date"
          addonAfter={
            <button
              onClick={() => {
                changeSol(parseInt(solDate), [
                  "curiosity",
                  "opportunity",
                  "spirit",
                ]);
              }}
            >
              Go
            </button>
          }
          step={1}
        />
        <nav id="rovers">
          <button
            id="curiosity"
            className="curiosity rover"
            onClick={() => {
              changeRover("curiosity");
            }}
          >
            CURIOSITY
          </button>

          <button
            id="opportunity"
            className="opportunity rover"
            onClick={() => {
              changeRover("opportunity");
            }}
          >
            OPPORTUNITY
          </button>
          <button
            id="spirit"
            className="spirit rover"
            onClick={() => {
              changeRover("spirit");
            }}
          >
            SPIRIT
          </button>
        </nav>
        <nav id="cameras">
          {cameras.map((camera) => (
            <button
              onClick={changeCamera}
              id={camera}
              key={camera}
              className={"camera " + name}
            >
              {camera}
            </button>
          ))}
        </nav>
        {posts}
      </div>
    </div>
  );
};

export default RoverPage;
