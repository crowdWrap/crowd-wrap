import React from 'react';
import LogoutButton from '../components/logout';
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';

async function fetchData(navigate:any){
    
    const response: Response = await fetch('/profile', {
        method: 'GET'})
  
        const receivedData = await response.json();
  
        if (response.ok) {
           navigate('/profile');
         } else {
           navigate('/login')
           alert(receivedData.message);
         }
        
}

function LoggedIn() {
    const navigate = useNavigate();
    useEffect(() => {
        fetchData(navigate)
    }, []);
  return (
    <div>
        <LogoutButton/>
      <h1>Welcome User</h1>
      <p>Logged in</p>
     
    </div>
  );
}

export default LoggedIn;




