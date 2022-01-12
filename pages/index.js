import { getRoverImages } from "../apis/mars-rover";
import {useEffect, useState} from "react";
import ImageCard from "../components/ImageCard";

export default function Home() {
  // ** //
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchRoverData() {
      await getRoverImages("1000", {camera: "RHAZ"}).then((response) => {
        const pictures = []
        response.map((photo) => (pictures.push(<ImageCard image={photo} likeState={false}/>)))
        setPosts(pictures)
      });
    }

    fetchRoverData().then(() => {
    });
  }, []);

  useEffect(() => {
    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        console.log(document.readyState);
        const cover = document.getElementById("cover");
        cover ? (cover.style.display = "block") : {};
      }
    };
  });

  return (
    <div id="cover" style={{ display: "none" }}>
      <div id="main">
        {posts}
      </div>
    </div>
  );
}
