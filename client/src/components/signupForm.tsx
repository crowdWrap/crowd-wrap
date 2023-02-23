import React from "react"; 
import '../signupForm.css';
import { useState } from "react";


export default function SignupForm(){

  const [registerUsername, setRegisterUsername] = useState<string>("")
  const [registerEmail, setRegisterEmail] = useState<string>("")
  const [registerPass, setRegisterPassword] = useState<string>("")
  const [registerConfirmPass, setRegisterConfirmPassword] = useState<string>("")
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
    if (registerPass !== registerConfirmPass) {
        console.log("Passwords do not match.");
    }
    else {
        const data = JSON.stringify({
            username: registerUsername,
            email: registerEmail,
            password: registerPass
          });
          console.log(data);
          
        fetch('/register', {
        
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
    }
    };



        return (
          <div className='wrapper signupForm'>
            <div className='form-wrapper'>
               <h2>Sign Up</h2>
               <form onSubmit={handleSubmit} noValidate >
                  <div className='fullName'>
                     <label htmlFor="fullName">Full Name</label>
                     <input type='text' name='fullName' placeholder="Full Name" onChange= {e => setRegisterUsername(e.target.value)}/>
                  </div>
                  <div className='email'>
                     <label htmlFor="email">Email</label>
                     <input type='email' name='email' placeholder="Email"onChange={e => setRegisterEmail(e.target.value)}/>
                  </div>
                  <div className='password'>
                     <label htmlFor="password">Password</label>
                     <input type='password' name='password' placeholder="Password" onChange={e => setRegisterPassword(e.target.value)}/>
                  </div>
                  <div className='confirm password'>
                     <label htmlFor="confirm password"> Confirm Password</label>
                     <input type='confirm password' name='confirm password' placeholder="Confirm Password" onChange={e => setRegisterConfirmPassword(e.target.value)}/>
                  </div>
                  <div className='submit'>
                     <button type='submit'>Sign Up</button>
                  </div>
             </form>
         </div>
      </div>
     );   
}

