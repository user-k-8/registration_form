import React from 'react'
import logo from './img/Logo (1).png'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'
import { ClipLoader } from 'react-spinners';

const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = React.useState("none");

  const [form, setForm] = React.useState( {
    email:"",
    password:"",
  }); 

const handleInputChange = event=>{  
    const {name, value, type, checked} = event.target
    setForm({...form, [name]: type==='checkbox' ? checked : value})
 }

const handleSubmit =(event)=>{
  event.preventDefault();
  
  setLoading("flex")
  fetch('https://registration-form-tv9c.onrender.com/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(form)
})
.then(response => response.json())
.then(data => {
    // response data
    console.log('Response from server:', data.token);
    setLoading("none")
    if(data.status==="404"){
      alert('Account does not exist! Enter correct email or register for an account')
    }
   else if(data.status==="401"){
      alert('Password invalid!')
    }
    else{ 
      alert('Login successful!');
      localStorage.setItem("token", data.token)
      navigate('/profile')   
    }
})
.catch(error => {
    console.log('Error:', error);
});
}

const submitGoogleUser =(user)=>{

  if(user.username){

    fetch('https://registration-form-tv9c.onrender.com/api/googlelogin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
          // response data
          console.log('Response from server:', data.token);
          alert('Login successful!');
          localStorage.setItem("token", data.token)
          navigate('/profile')        
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}
  
  return (
    <div className='register-container'>
        <div className='register-container-left'>
              <div >
                <img className='logo' src={logo} alt=''/>
              </div>
              <div className='form-container'>
                 <h1>LOG IN</h1>
                 <h3>Log into your account</h3>
                 
                 <div className='google-btn-container'>
                 <GoogleLogin
                       width={230}
                       text='continue_with'
                       logo_alignment='left'
                       onSuccess={credentialResponse => {
                       console.log(credentialResponse);
                       const userObject = jwtDecode(credentialResponse.credential)
                       console.log(userObject)
                       const userDetails = {username: userObject.name,  email: userObject.email, password:"", rememberMe: true}
                       submitGoogleUser(userDetails)
                     }}
                     onError={() => {
                    console.log('Login Failed'); }}/>
                 </div>

                 <div className='or-container'>
                    <hr/> Or <hr/>
                 </div>
                <form onSubmit={handleSubmit}>        
                  <input type="email" id="email" name="email" value={form.email} placeholder='Email'  onChange={handleInputChange} required/> 
                  <input type="password" id="password" name="password" value={form.password} placeholder='Password' onChange={handleInputChange} required/>
                  <button type='submit'>Log in <span style={{display: loading}}> <ClipLoader color={'white'} size={25}/></span></button>
              </form>
               <Link to='/' style={{textDecoration: "none"}}><h4 style={{color: "black", fontWeight:"400"}}>Don't have an account? <span style={{color: "orange"}}>Register</span></h4></Link>
               <Link to='/forgot-password' style={{textDecoration: "none"}}><h4 style={{color: "black", fontWeight:"400"}}> Forgot Password? ▶ </h4></Link>
            </div>
        </div>
        <div className='register-container-right'>
        </div>
    </div>
  )
}

export default Login