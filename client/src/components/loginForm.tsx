import React from "react"; 
import '../signupForm.css';
import { useState } from "react";

export default function LoginForm(){


  const [loginUsername, setLoginUsername] = useState<string>("")
  const [loginEmail, setLoginEmail] = useState<string>("")
  const [loginPass, setLoginPassword] = useState<string>("")

    const handleSubmit = (event : any) => {}
    
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
                     <button>Sign Up</button>
                  </div>
             </form>
         </div>
      </div>
     );
}