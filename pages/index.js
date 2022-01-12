import styles from "../styles/Home.module.css";
import { getRoverImages } from "../apis/mars-rover";
import { useEffect } from "react";

export default function Home() {
  // ** //
  useEffect(() => {
    async function fetchRoverData() {
      await getRoverImages("1", {}).then((response) => {
        console.log(response);
      });
    }

    fetchRoverData().then(() => {});
  });

  useEffect(() => {
    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        console.log(document.readyState)
        const cover = document.getElementById("cover");
        cover ? (cover.style.display = "block") : {};
      }
    };
  });

  return (
      <div id="cover" className={styles.main} style={{display: "none"}} >
        <h1>
          Welcome to <a href="https://stephenmustapha.com">Spacestagram</a>
        </h1>
      </div>
  );
}
