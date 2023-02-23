import React from "react"; 
import '../assets/form.css';
import { useState } from "react";
import {Link, Router} from 'react-router-dom'

export default function LoginForm(){


  const [loginUsername, setLoginUsername] = useState<string>("")
  const [loginEmail, setLoginEmail] = useState<string>("")
  const [loginPass, setLoginPassword] = useState<string>("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
      const data = JSON.stringify({
         username: loginUsername,
         email: loginEmail,
         password: loginPass
      });
     

      fetch('/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: data
      })
      .then(response => {
         console.log(response);
         response.json();
         console.log(data);
      })
      .catch(error => console.error(error));
   };    
        return (
          <div className='wrapper loginForm'>
            <div className='form-wrapper'>
               <h2>Log In</h2>
               <form onSubmit={handleSubmit} noValidate >
                  <div className='username'>
                     <label htmlFor="username">Username</label>
                     <input type='text' name='username' placeholder="Username" onChange= {e => setLoginUsername(e.target.value)}/>
                  </div>
                  <div className='email'>
                     <label htmlFor="email">Email</label>
                     <input type='email' name='email' placeholder="Email" onChange={e => setLoginEmail(e.target.value)}/>
                  </div>
                  <div className='password'>
                     <label htmlFor="password">Password</label>
                     <input type='password' name='password' placeholder="Password" onChange= {e => setLoginPassword(e.target.value)}/>
                  </div>
                  <div className='submit'>
                  <button type='submit' >Login</button>
                  </div>

             </form>

             
         </div>
         <div className="btnWrap">
      <Link to="/register"><button className="signupBtn"> Don't Have an Account?</button></Link>
      <Link to="/"><button className="loginBtn"> Home</button></Link> 
      </div>
      </div>
     );
}