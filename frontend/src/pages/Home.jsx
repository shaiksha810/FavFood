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

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  // Like & Save
  const [liked, setLiked] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [saved, setSaved] = useState({});
  const [savesCount, setSavesCount] = useState({});

  // Comments
  const [openCommentFor, setOpenCommentFor] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  // Auto play/pause scroll handler
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

  // Fetch videos
  useEffect(() => {
    axios
      .get(`${API_URL}/api/food`, { withCredentials: true })
      .then((res) => {
        const foodItems = res.data.foodItems;
        setVideos(foodItems);

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
      .catch((err) => console.error("Error fetching food:", err));
  }, []);

  // Like
  const toggleLike = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/food/like`,
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

  // Save
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

  // Show comments
  const handleCommentClick = async (id) => {
    setOpenCommentFor(id);
    try {
      const res = await axios.get(`${API_URL}/api/food/${id}/comments`, {
        withCredentials: true,
      });
      const fetchedComments = res.data.comments;

      setComments((prev) => ({ ...prev, [id]: fetchedComments }));
      setVideos((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, commentCount: fetchedComments.length } : v
        )
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Add comment
  const handleAddComment = async (id) => {
    const text = commentInput[id]?.trim();
    if (!text) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/food/addcomment`,
        { foodId: id, text: commentInput[id] },
        { withCredentials: true }
      );

      const newComment = res.data.comment;

      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), newComment],
      }));

      setCommentInput((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

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
            <div className="action" onClick={() => toggleLike(item._id)}>
              {liked[item._id] ? (
                <FaHeart className="icon liked" />
              ) : (
                <FaRegHeart className="icon" />
              )}
              <span>{likesCount[item._id] ?? 0}</span>
            </div>

            <div className="action" onClick={() => toggleSave(item._id)}>
              {saved[item._id] ? (
                <FaBookmark className="icon saved" />
              ) : (
                <FaRegBookmark className="icon" />
              )}
              <span>{savesCount[item._id] ?? 0}</span>
            </div>

            <div
              className="action"
              onClick={() => handleCommentClick(item._id)}
            >
              <FaCommentDots className="icon" />
              <span>{(comments[item._id] || []).length}</span>
            </div>
          </div>

          {/* Overlay */}
          <div className="overlay">
            <p className="description">{item.description}</p>
            <Link to={`food-partner/${item.foodPartner}`} className="visit-btn">
              Visit Store
            </Link>
          </div>

          {/* Comments Drawer */}
          {openCommentFor === item._id && (
            <div className="comment-drawer">
              <div className="comment-header">
                <h3>Comments</h3>
                <button
                  className="close-btn"
                  onClick={() => setOpenCommentFor(null)}
                >
                  ✖
                </button>
              </div>

              <div className="comments-list">
                {(comments[item._id] || []).map((comment, idx) => (
                  <div key={idx} className="comment">
                    <strong>{comment.user?.fullName || "User"}:</strong>{" "}
                    {comment.text}
                  </div>
                ))}
              </div>

              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput[item._id] || ""}
                  onChange={(e) =>
                    setCommentInput((prev) => ({
                      ...prev,
                      [item._id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => handleAddComment(item._id)}>Post</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Bottom Navigation */}
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
