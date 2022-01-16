import { getRoverImages } from "../apis/mars-rover";
import { useEffect, useState } from "react";
import ImageCard from "../components/ImageCard";
import RoverPage from "../components/RoverPage";

export default function Home() {
  // ** //
  const [body, setBody] = useState();

  useEffect(() => {
    async function fetchRoverData() {
      await getRoverImages("100", "spirit").then((response) => {
        let cameraNames = Object.keys(response);
        const rovers = {};
        cameraNames.map((camera) => {
          const pictures = [];
          response[camera].map((photo) =>
            pictures.push(
              <ImageCard image={photo} likeState={false} key={photo.id} />
            )
          );
          rovers[camera] = pictures;
        });
        setBody(<RoverPage name="Spirit" roverData={rovers} />);
      });
    }

    fetchRoverData();
  }, []);

  useEffect(() => {
    window.addEventListener("load", function () {
      if (document.readyState === "complete") {
        const cover = document.getElementById("cover");
        cover ? (cover.style.display = "block") : {};
      }
    });
  });

  return (
    <div id="cover" style={{ display: "none" }}>
      {body}
    </div>
  );
}
