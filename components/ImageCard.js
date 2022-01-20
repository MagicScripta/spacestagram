// ** //
import { useEffect, useState } from "react";

const ImageCard = ({ image, likeState, name }) => {
  const [liked, setLiked] = useState(likeState);
  let likeButton = liked === "true" ? "/like.gif" : "/unlike.gif";

  useEffect(() => {
    localStorage.setItem("like-" + image.id, liked);
  }, [liked]);

  const onLike = () => {
    if (liked === "true") {
      setLiked("false");
    } else {
      setLiked("true");
    }
  };

  return (
    <div id="card" className={name}>
      <img src={image.img_src} alt={"Couldn't find the image"} />
      <p>Date: {image.earth_date}</p>
      <button onClick={onLike}>
        <img id={"like-" + image.id} className="likeButton" src={likeButton} />
      </button>
    </div>
  );
};

export default ImageCard;
