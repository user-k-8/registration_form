import React from 'react'
import logo from './img/Logo (1).png'

const ResetMessage = () => {
  
  return (
    <div className='register-container'>
    <div className='register-container-left'>
          <div className='logo-container'>
            <img className='logo' src={logo} alt=''/>
          </div>
          <div className='form-container forgot-form-container'>
             <h1>RESET PASSWORD</h1><br/>
             <h3>An email has been sent to your provided email address. Follow the link in the email to reset your password.</h3>     
        </div>
    </div>
    <div className='register-container-right'>
    </div>
</div>
  )
}

export default ResetMessage