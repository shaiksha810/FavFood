import "../styles/FormPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega

const UserLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post(
<<<<<<< HEAD
      "https://favfood-kea0.onrender.com/api/auth/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
=======
      `${API_URL}/api/auth/user/login`,
      { email, password },
      { withCredentials: true }
>>>>>>> edc397a (Fix: updated server config and env setup for deployment)
    );

    console.log(response.data);
    navigate("/");
  };

  return (
    <div className="form-page">
      <form className="form-container" onSubmit={handleLogin}>
        <div className="form-title">User Login</div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" placeholder="Enter password" />
        </div>
        <button className="form-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default UserLogin;


