import React from 'react'
import logo from './img/Logo (1).png'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = React.useState("none");

    const [form, setForm] = React.useState( {
        email:"",
      }); 
    
    const handleInputChange = event=>{  
        const {name, value, type, checked} = event.target
        setForm({...form, [name]: type==='checkbox' ? checked : value})
     }
    
    const handleSubmit =(event)=>{
      event.preventDefault();
     
      setLoading("flex")
      fetch('https://registration-form-tv9c.onrender.com/api/forgot-password', {
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
        console.log('Response from server:', data);
        setLoading("none")
        if(data.status === 404){
          alert(data.message)
        }
        else{
          navigate('/reset')
        }      
     })
    .catch(error => {
        console.log('Error:', error);
    });


    }
  return (
    <div className='register-container'>
        <div className='register-container-left'>
              <div className='logo-container'>
                <img className='logo' src={logo} alt=''/>
              </div>
              <div className='form-container forgot-form-container'>
                 <h1>FORGOT PASSWORD</h1>
                 <h3>Enter your account email to reset password</h3>
              
                <form onSubmit={handleSubmit}>        
                  <input type="email" id="email" name="email" value={form.email} placeholder='Email'  onChange={handleInputChange} required/> 
                  <button type='submit' className='submit-btn'>Submit <span style={{display: loading}}> <ClipLoader color={'white'} size={25}/></span></button>
              </form>
            </div>
        </div>
        <div className='register-container-right'>
        </div>
    </div>
  )
}

export default ForgotPassword