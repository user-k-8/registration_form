import React from 'react'
import logo from './img/Logo (1).png'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'
import { Link } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();
  const [form, setForm] = React.useState( {
    username:"",
    email:"",
    password:"",
    rememberMe: false
    
  }); 

const handleInputChange = event=>{  
    const {name, value, type, checked} = event.target
    const updatedForm = {...form, [name]: type==='checkbox' ? checked : value}
    setForm(updatedForm);
   return
 }

 const [helpText, setHelpText] = React.useState({username:"none", password:"none"});
 const [correctInput , setCorrectInput] = React.useState({username: false, password: false})

 const validateNameInput= (event)=>{

  const updatedForm = {...form, [event.target.name]: event.target.value}
  setForm(updatedForm)
  const namePattern = /^[A-Za-z]+$/; 
  const namevalue = updatedForm.username.trim();

  if(namevalue.match(namePattern) && namevalue.length>2){
    setHelpText({...helpText, username:"none"})
    setCorrectInput({...correctInput, username: true})
  }else{
    setHelpText({...helpText, username:"block"})
  }
  return
 }

 const validatePasswordInput =(event)=>{

   const updatedForm = {...form, [event.target.name]: event.target.value}
  setForm(updatedForm)
  const passwordValue =  updatedForm.password.trim();
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}$/;
  if(passwordValue.match(passwordPattern)){
    setHelpText({...helpText, password: "none"})
    setCorrectInput({...correctInput, password: true})
  }else{
    setHelpText({...helpText, password: "block"})
  }
 }
 
 const handleSubmit = (event)=>{
     event.preventDefault();

     if(correctInput.username && correctInput.password){

      fetch('https://registration-form-tv9c.onrender.com/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(form)
      }).then(response=> response.json())
      .then(data => {
        //  response data from the server
        console.log('server response', data.status)
        if(data.status===409){
          alert('Email already registered')
        }
        else{
          alert('Registration successful!');
          navigate('/login')    
        }    
      })
      .catch(error => {
        console.error('Error:', error);
      });
  

     }
    
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
              <div>
                <img className='logo' src={logo} alt=''/>
              </div>
              <div className='form-container'>
                 <h1>SIGN UP</h1>
                 <h3>Create an account to get started</h3>

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
                       console.log(userDetails)
                       submitGoogleUser(userDetails)
                     }}
                     onError={() => {
                    console.log('Login Failed'); }}/>
                 </div>
              
                 <div className='or-container'>
                    <hr/> Or <hr/>
                 </div>

                <form onSubmit={handleSubmit}>        
                  
                  <input type="text" id="username" name="username" value={form.username} placeholder='Name'  onChange={validateNameInput} required/>     
                  <div className='help-text' style={{display: helpText.username}} >Please enter a name containing at least 3 alphabetical characters</div>
                  
                  <input type="email" id="email" name="email" value={form.email} placeholder='Email'  onChange={handleInputChange} required/> 
                  
                  <input type="password" id="password" name="password" value={form.password} placeholder='Password' onChange={validatePasswordInput} required/>
                  <div className='help-text' style={{display: helpText.password}}>Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character e.g   Q2wertyu2#</div>
                  
                  <div className='check-container'>
                      <input type="checkbox" id="rememberMe" name='rememberMe' checked={form.rememberMe} onChange={handleInputChange}/>    
                      <label htmlFor="rememberMe" > Remember Me</label>
                  </div>
                  <button type='submit'>Register</button>
              </form>
              <Link to='/login' style={{textDecoration: "none"}}><h4 style={{color: "black", fontWeight:"400"}}>Already have an account? <span style={{color: "orange"}}>Log in</span></h4></Link>
              <Link to='/forgot-password' style={{textDecoration: "none"}}><h4 style={{color: "black", fontWeight:"400"}}> Forgot Password? ▶ </h4></Link>
            </div>
        </div>
        <div className='register-container-right'>
        </div>
    </div>
  )
}

export default Register