import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Saved.css"; // 👈 CSS alag likhenge neeche
const API_URL = import.meta.env.VITE_API_URL;

const Saved = () => {
  const [savedReels, setSavedReels] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/food/saved`, { withCredentials: true })
      .then((res) => {
        console.log("Response:", res.data);

        // Backend se array aa raha hai (each item has 'food' inside)
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.savedReels || [];

        setSavedReels(data);
      })
      .catch((err) => {
        console.error(err);
        setSavedReels([]);
      });
  }, []);

  return (
    <div className="saved-container">
      <h2 className="saved-title">Saved Reels</h2>

      <div className="saved-grid">
        {savedReels.length > 0 ? (
          savedReels.map((item) => (
            <div key={item._id} className="saved-card">
              {item.food?.video ? (
                <video
                  src={item.food.video}
                  className="saved-video"
                  controls
                  loop
                  muted
                />
              ) : (
                <img
                  src={item.food?.image}
                  alt={item.food?.name || "food"}
                  className="saved-video"
                />
              )}
              <div className="saved-info">
                <p className="saved-name">{item.food?.name}</p>
                <p className="saved-desc">{item.food?.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-saved">No saved reels yet 😢</p>
        )}
      </div>
    </div>
  );
};

export default Saved;
