// ** //
import {useEffect, useState} from "react";

const RoverPage = ({ name, roverData }) => {
  // ** //
  console.log(roverData)
  const [roverPosts, setRoverPosts] = useState(roverData);
  const [cameras, setCameras] = useState(Object.keys(roverPosts));
  const [posts, setPosts] = useState(roverPosts[cameras[0]]);

  const changeCamera = (clickedCamera) => {
    const cameraId = clickedCamera.target.id;
    setPosts(roverPosts[cameraId]);
    const buttons = document.querySelectorAll(".camera");
    buttons.forEach((camera) =>
      cameraId == camera.id
        ? camera.setAttribute("disabled", "")
        : camera.removeAttribute("disabled")
    );
  };

  return (
    <div id="main">
      <nav>
          <button>CURIOSITY</button>
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
  );
};

export default RoverPage;
