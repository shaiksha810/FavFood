import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/ReelsPage.css";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaCommentDots,
  FaHome,
} from "react-icons/fa";

  const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega



const Home = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const [liked, setLiked] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [saved, setSaved] = useState({});
  const [savesCount, setSavesCount] = useState({});

  const handleScroll = () => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      const rect = video.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        video.play();
      } else {
        video.pause();
      }
    });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/food`, { withCredentials: true })
      .then((res) => {
        const foodItems = res.data.foodItems;
        setVideos(foodItems);

        // Initialize like/save states from API
        const initialLikes = {};
        const initialLikesCount = {};
        const initialSaved = {};
        const initialSavesCount = {};

        foodItems.forEach((item) => {
          initialLikes[item._id] = item.isLikedByUser || false;
          initialLikesCount[item._id] = item.likeCount || 0;
          initialSaved[item._id] = item.isSavedByUser || false;
          initialSavesCount[item._id] = item.savesCount || 0;
        });

        setLiked(initialLikes);
        setLikesCount(initialLikesCount);
        setSaved(initialSaved);
        setSavesCount(initialSavesCount);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleLike = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/food`,
        { foodId: id },
        { withCredentials: true }
      );
      const { isLiked, likeCount } = res.data;
      setLiked((prev) => ({ ...prev, [id]: isLiked }));
      setLikesCount((prev) => ({ ...prev, [id]: likeCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSave = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/food/save`,
        { foodId: id },
        { withCredentials: true }
      );
      const { isSaved, savesCount } = res.data;
      setSaved((prev) => ({ ...prev, [id]: isSaved }));
      setSavesCount((prev) => ({ ...prev, [id]: savesCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const getSavedReels = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/food/saved`,
        { foodId: id },
        { withCredentials: true }
      );
      const { isSaved, savesCount } = res.data;
      setSaved((prev) => ({ ...prev, [id]: isSaved }));
      setSavesCount((prev) => ({ ...prev, [id]: savesCount }));
      
    } catch (err) {
      console.error(err);
    }
  };
  console.log(getSavedReels.data);

  return (
    <div className="container" onScroll={handleScroll}>
      {videos.map((item, index) => (
        <div key={item._id} className="video-wrapper">
          {item.video ? (
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.video}
              className="video"
              preload="metadata"
              playsInline
              muted
              loop
            />
          ) : (
            <img src={item.image} alt="food" className="video" />
          )}

          {/* Right side icons */}
          <div className="actions">
            {/* Like / Unlike */}
            <div className="action" onClick={() => toggleLike(item._id)}>
              {liked[item._id] ? (
                <FaHeart className="icon liked" />
              ) : (
                <FaRegHeart className="icon" />
              )}
              <span>{likesCount[item._id] ?? 0}</span>{" "}
            </div>

            <div className="action" onClick={() => toggleSave(item._id)}>
              {saved[item._id] ? (
                <FaBookmark className="icon saved" />
              ) : (
                <FaRegBookmark className="icon" />
              )}
              <span>{savesCount[item._id] ?? 0}</span>{" "}
            </div>

            <div className="action">
              <FaCommentDots className="icon" />
              <span>45</span>
            </div>
          </div>

          <div className="overlay">
            <p className="description">{item.description}</p>
            <Link to={`food-partner/${item.foodPartner}`} className="visit-btn">
              Visit Store
            </Link>
          </div>
        </div>
      ))}

      <div className="bottom-nav">
        <Link to="/" className="nav-item">
          <FaHome /> <span>Home</span>
        </Link>
        <Link to="/saved" className="nav-item">
          <FaBookmark /> <span>Saved</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
