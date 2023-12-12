import React from 'react'
import logo from './img/Logo (1).png'
import {jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'

const Profile = () => {

  const [profileInfoDisplay, setProfileInfoDisplay] = React.useState("none")
  const [buttonDisplay, setButtonDisplay] = React.useState("block")

  const token = localStorage.getItem("token");
  const decodedToken = token && token!== 'undefined' ? jwtDecode(token) : "";
  const username = decodedToken.username
  const email = decodedToken.email

  if(!token || token==='undefined'){
    return (
       <div className='redirect-container'>
          <img src={logo} alt=''/>
          <h1 >Login to access profile</h1>
          <Link to='/'><button className='profile-btn'>Log in</button></Link>      
       </div>
    )
}

  const showProfileInfo = ()=>{

    fetch('https://registration-form-tv9c.onrender.com/api/profile-info', {
      method: 'GET',
      headers: {
        'access-token': token
    },
    mode: 'cors',
  })
  .then(response => response.json())
  .then(data => {
      // response data
      console.log('Response from server:', data);
      if(data === "Authenticated"){
          setProfileInfoDisplay("block");
          setButtonDisplay("none")
      }else{
        alert("You are not authenticated")
      } 
  })
  .catch(error => {
      console.log('Error:', error);
  });
  }

return (
<div className='profile'>
    <div className='profile-container'>
        <img src={logo} alt=''/>
        <div className='profile-image'></div>
        <h1>Welcome, {username}!</h1>
        <h2 style={{textDecoration: "underline", display: profileInfoDisplay}}>Profile Information</h2>
        <span style={{ display: profileInfoDisplay}}> <span style={{fontWeight: "600"}}>Name: </span> {username}</span><br/>
        <span  style={{ display: profileInfoDisplay}}><span style={{fontWeight: "600"}}>Email: </span> {email}</span><br/>
        <button style={{display: buttonDisplay}} className='profile-btn' onClick={showProfileInfo}>Show Profile Information</button>
    </div>
</div>

  )
}

export default Profile