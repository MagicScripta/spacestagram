// ** //
import {useState} from "react";

const ImageCard = ({ image, likeState }) => {
  const [liked, setLiked] = useState(likeState);
  let likeButton = liked ? "/like.gif" : "/unlike.gif"

    const onLike = () => {
      if (liked) {
          setLiked(false)
      }
      else {
          setLiked(true)
      }
    }

  return (
    <div id="card">
      <img src={image.img_src} alt={"Couldn't find the image"} />
      <p>Date: {image.earth_date}</p>
        <button onClick={onLike}><img id={"like-"+image.id} className="likeButton" src={likeButton} /></button>
    </div>
  );
};

export default ImageCard;
