import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile'
import ForgotPassword from './components/ForgotPassword';
import ResetMessage from './components/ResetMessage';
function App() {
  return (
    <div>
       <HashRouter>
            <Routes>
               <Route path='/' element={<Register/>}/>    
               <Route path='/login' element={<Login/>}/> 
               <Route path='/forgot-password' element={<ForgotPassword/>}/>       
               <Route path='/reset' element={<ResetMessage/>}/>  
               <Route path='/profile' element={<Profile/>}/>
            </Routes>
       </HashRouter>
    </div>
  );
}

export default App;
