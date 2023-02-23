import React from "react"; 
import '../signupForm.css';
import { useState } from "react";

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
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
   };    
        return (
          <div className='wrapper loginForm'>
            <div className='form-wrapper'>
               <h2>Log In</h2>
               <form onSubmit={handleSubmit} noValidate >
                  <div className='fullName'>
                     <label htmlFor="fullName">Full Name</label>
                     <input type='text' name='fullName' onChange= {e => setLoginUsername(e.target.value)}/>
                  </div>
                  <div className='email'>
                     <label htmlFor="email">Email</label>
                     <input type='email' name='email' onChange={e => setLoginEmail(e.target.value)}/>
                  </div>
                  <div className='password'>
                     <label htmlFor="password">Password</label>
                     <input type='password' name='password' onChange= {e => setLoginPassword(e.target.value)}/>
                  </div>
                  <div className='submit'>
                  <button type='submit' >Login</button>
                  </div>
             </form>
         </div>
      </div>
     );
}