import { useParams } from "react-router-dom";
import "../styles/profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega


const Profile = () => {
  const { id } = useParams(); // extract param from route
  // console.log(id);

  const [profile, setProfile] = useState(null); // store API response
  const [foodItems, setFoodItems] = useState(null); // store API response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/food-partner/${id}`,
          { withCredentials: true }
        );

        setProfile(response.data.foodPartner);
        setFoodItems(response.data.foodPartner.foodItems);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="phone-frame">
      <div className="card">
        {/* Top Section */}
        <div className="top-section">
          <div className="logo"></div>
          <div className="info">
            <button className="btn">{profile.name}</button>
            <button className="btn">{profile.address}</button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats">
          <div className="stat">
            <p>Total Meals</p>
            <h3>{foodItems.totalMeals}</h3>
          </div>
          <div className="stat">
            <p>Customer Served</p>
            <h3>{profile.customersServed}</h3>
          </div>
        </div>

        {/* Reels Grid */}
        <div className="reels-grid">
          {foodItems && foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div key={item._id} className="reel">
                <video
                  src={item.video}
                  controls
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />

                {/* Overlay Info (bottom-left) */}
                <div className="overlay">
                  <p className="video-desc">{item.description}</p>
                  <a
                    href={item.storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-btn"
                  >
                    Visit Store
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No videos found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
