import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega


const Saved = () => {
  const [savedReels, setSavedReels] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/food/saved` ,{ withCredentials: true })
      .then((res) => {
        setSavedReels(res.data.savedReels);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>Saved Reels</h2>
      {savedReels.map((item) => (
        <div key={item._id} className="video-wrapper">
          {item.video ? (
            <video
              src={item.video}
              className="video"
              controls
              loop
              muted
            />
          ) : (
            <img src={item.image} alt="food" className="video" />
          )}
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Saved;
