import React from 'react'
import '../styles/FormPage.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL; // 👈 ye env se aayega



const FoodPartnerRegister = () => {
   const navigate = useNavigate();

   const onFoodPartnerHandler = async (e) => {

   e.preventDefault();
   
   const name =  e.target.name.value
   const email =  e.target.email.value
   const password =  e.target.password.value
   const address =  e.target.address.value
   const phone =  e.target.phone.value
   const contactName =  e.target.contactName.value


   
    const response = await axios.post(
      `${API_URL}/api/auth/food-partner/register`,
      {
        name,
        email,
        password,
        address,
        phone,
        contactName
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
    <form className="form-container" onSubmit={onFoodPartnerHandler}>
      <div className="form-title">Food Partner Registration</div>
      <div className="form-group">
        <label className="form-label">Restaurant Name</label>
        <input className="form-input" type="text" placeholder="Enter restaurant name" name='name' />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder="Enter email" name='email' />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="Enter password" name='password' />
      </div>
       <div className="form-group">
        <label className="form-label">Address</label>
        <input className="form-input" type="text" placeholder="Enter Address" name='address'/>
      </div>
       <div className="form-group">
        <label className="form-label">Phone</label>
        <input className="form-input" type="number" placeholder="Enter Phone" name='phone'/>
      </div>
       <div className="form-group">
        <label className="form-label">Contact</label>
        <input className="form-input" type="text" placeholder="Enter Contact Details" name='contactName'/>
      </div>
      <button className="form-btn" type="submit">Register</button>
    </form>
  </div>
)}

export default FoodPartnerRegister