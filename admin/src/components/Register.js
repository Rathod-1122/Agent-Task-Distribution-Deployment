import React, { useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

function Register() {
  let emailRef = useRef();
  let passwordRef = useRef();

  // axios.defaults.baseURL = 'http://localhost:4444';

  let registerUser = async () => {

    let dataToSend = new FormData();
    dataToSend.append('email', emailRef.current.value);
    dataToSend.append('password', passwordRef.current.value);

    let response = await axios.post('/register', dataToSend);

    alert(response.data.message)

  }
  return (
    <div className='registerform-container'>
      {/* Form for registering as Admin user */}
      <form>
        <fieldset>
          <legend>Register</legend>
          <div>
            <label>Email</label>
            <input type='email' ref={emailRef}></input>
          </div>
          <div>
            <label>Password</label>
            <input type='text' ref={passwordRef}></input>
          </div>
          <div>
            <button type='button' onClickCapture={() => {
              registerUser();
            }}>Register</button>
          </div>
        </fieldset>
      </form><br></br>
      {/* Link to go back to the login page */}
      <Link to='/'>Login</Link>
    </div>
  )
}

export default Register