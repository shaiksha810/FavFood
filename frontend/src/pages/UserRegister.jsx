import axios from "axios";
import { useNavigate } from "react-router-dom";



const UserRegister = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
  const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega

    e.preventDefault()
    const fullName = e.target.name.value;    
    const email = e.target.email.value;    
    const password = e.target.password.value;    

     const response = await axios.post(
      `${API_URL}/api/auth/user/login`,
      { email, password,fullName },
      { withCredentials: true }
    );


    console.log(response.data);
    
    navigate('/');
    
  }
  return (
    <div className="form-page">
      <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-title">User Registration</div>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your name"
            name="name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            name="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter password"
            name="password"
          />
        </div>
        <button className="form-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
