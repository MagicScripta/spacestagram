// ** //
import { useEffect, useState } from "react";
import { getRoverImages } from "../apis/mars-rover";
import ImageCard from "./ImageCard";
import {useRouter} from "next/router";



const RoverPage = ({ name }) => {
  // ** //
  const {query, isReady} = useRouter()
  const sol = query["sol"]
  const [roverPosts, setRoverPosts] = useState({});
  const [cameras, setCameras] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchRoverData() {
      if (isReady) {
        const sol = sol ? sol : 1
      await getRoverImages(sol, name).then((response) => {
        let cameraNames = Object.keys(response);
        const camPosts = {};
        const cams = []
        cameraNames.map((camera) => {
            cams.push(camera)
          const pictures = [];
          response[camera].map((photo) =>
            pictures.push(
              <ImageCard image={photo} likeState={false} key={photo.id} />
            )
          );
          camPosts[camera] = pictures;
        });
        setRoverPosts(camPosts)
          setCameras(cams)
          setPosts(camPosts[cams[0]].splice(1,20))
      });}
    }

    fetchRoverData().then((resp) => {
        const cover = document.getElementById("cover");
        cover ? (cover.style.display = "block") : {};});
  }, [sol, isReady, name]);

  const changeCamera = (clickedCamera) => {
    const cameraId = clickedCamera.target.id;
    setPosts(roverPosts[cameraId]);
    const buttons = document.querySelectorAll(".camera");
    buttons.forEach((camera) =>
      cameraId === camera.id
        ? camera.setAttribute("disabled", "")
        : camera.removeAttribute("disabled")
    );
  };

  useEffect(() => {
    const page = document.getElementById('main')
    window.onscroll = (ev) => {
    console.log(page.offsetHeight, page.scrollTop, page.scrollHeight)
    if (page.offsetHeight + page.scrollTop >= page.scrollHeight) {
      console.log("end")
    }}
  })

  return (
    <div id="cover" style={{ display: "none" }}>
      <div id="main">
        <nav>
          <button onClick={() => {
            console.log(posts.length)}}>CURIOSITY</button>
          <button>OPPORTUNITY</button>
          <button>SPIRIT</button>
        </nav>
        <nav>
          {cameras.map((camera) => (
            <button
              onClick={changeCamera}
              id={camera}
              key={camera}
              className="camera"
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
