import React from 'react'
import '../styles/FormPage.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega



const FoodPartnerLogin = () => {
   const navigate = useNavigate();

   const onFoodPartnerLogin = async (e) => {

   e.preventDefault();
   
   const email =  e.target.email.value
   const password =  e.target.password.value


   
    const response = await axios.post(
      `${API_URL}/api/auth/food-partner/login`,      
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    console.log(response.data);
    navigate("/create-food");
  };

return (
    <div className="form-page">
    <form className="form-container" onSubmit={onFoodPartnerLogin}>
      <div className="form-title">Food Partner Login</div>
     
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder="Enter email" name='email' />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="Enter password" name='password' />
      </div>
      <button className="form-btn" type="submit">Sign In</button>
    </form>
  </div>
)}

export default FoodPartnerLogin